import { getPackageJson, getMissingTypes, hasOwnTypes, hasAtTypes, install } from '@tdsm/core';
import cachefile from '@tdsm/cache';
import { Options, Library } from '@tdsm/types';
import logger from '@tdsm/logger';
import ansis from 'ansis';
import semver from 'semver';
import resolveVersion from 'resolve-version';
import { createSpinner } from 'nanospinner';
import pMapSeries from 'p-map-series';
import Module from 'module';

const pkg = getPackageJson();
const version = resolveVersion('tdsm') || ' unknown';
const cache = cachefile();

async function run(options: Options): Promise<void> {
    logger.log(
        ansis.blueBright(`
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ┃ ${ansis.white.bold('tdsm')} ${ansis.white('•')} ${ansis.gray('v' + version)}
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`),
    );

    if (!pkg) return logger.error("Couldn't find `package.json` in", options.pkgDir);
    if (options.debug) logger.shouldDebug = true;

    const startTime = Date.now();

    let missing = getMissingTypes(pkg).filter(({ dependency, version }) => {
        return (
            !options.ignore.includes(dependency) &&
            !cache.getData.some((e) => e.dependency === dependency && semver.intersects(e.version, version) && e.ignore)
        );
    });

    missing = missing.filter(({ dependency }) => {
        if (options.builtins || !Module.builtinModules.includes(dependency)) return true;

        logger.warn(dependency, 'is a built-in module. To include built-in modules use', ansis.gray('--built-ins'));
        return false;
    });

    if (!missing.length) {
        logger.log('No missing dependencies found.');
        return;
    }

    missing = missing.filter((lib) => {
        const hasTypes = cache.find(lib)?.hasOwnTypes || hasOwnTypes(lib.dependency);
        cache.push(lib, { ignore: false, hasOwnTypes: hasTypes });
        return !hasTypes;
    });

    if (!missing.length) {
        logger.log('No missing dependencies found.');
        cache.save();
        return;
    }

    const spinner = createSpinner('Checking dependencies...', { color: 'blue' }).start();
    const startCheckingTime = Date.now() / 1e3;

    missing = (
        await pMapSeries(missing, async (lib, i) => {
            spinner.update({
                text: `Checking: ${lib.dependency}${lib.version ? '@' + lib.version : ''} (${i + 1} out of ${
                    missing.length
                })`,
            });

            const hasTypes = cache.find(lib)?.hasAtTypes || (await hasAtTypes(lib.dependency));
            cache.push(lib, { ignore: false, hasAtTypes: hasTypes });

            if (!hasTypes) {
                spinner.clear();
                logger.warn(
                    `${lib.dependency}${
                        lib.version ? '@' + lib.version : ''
                    } doesn't provide any typescript declarations`,
                );
                spinner.start();
                return;
            }
            return lib;
        })
    ).filter((lib) => lib) as Library[];

    spinner.stop({
        text: `Done checking. (${(Date.now() / 1e3 - startCheckingTime).toFixed(1)}s)`,
        color: 'green',
        mark: process.platform === 'win32' ? '√' : '✔',
    });

    if (!missing.length) {
        logger.log('No missing dependencies found.');
        cache.save();
        return;
    }

    logger.log(
        '\n',
        ansis.bold(`Found ${missing.length} missing dependencies:`),
        '\n',
        missing
            .map((lib) => `${ansis.green('• ')}${lib.dependency}${lib.version ? ansis.gray('@' + lib.version) : ''}\n`)
            .join(' '),
        '\n',
    );

    await install(
        missing.map(({ dependency }) => dependency),
        options.manager,
        options.save,
    );
    cache.save();

    const endTime = Date.now();

    logger.info(`Done. (${((endTime - startTime) / 1e3).toFixed(1)}s)`);
}

export default run;
