import fs from 'fs';
import path from 'path';
import readPkgUp from 'read-pkg-up';
import log from 'proc-log';
import findUpKeys from 'find-up-keys';

/**
 * Checks whether a dependency has built-in typings, like `index.d.ts`.
 * @param {string} dependency Dependency, e.g. `chalk`
 * @returns {boolean}
 */
// eslint-disable-next-line consistent-return
function hasOwnTypes(dependency: string): boolean {
    try {
        const moduleDir = path.join(process.cwd(), 'node_modules', ...dependency.split('/'));
        const { packageJson, path: packagePath } = readPkgUp.sync({ cwd: moduleDir }) || {};
        log.verbose(`${dependency}'s package path: `, packagePath);

        if (!packageJson || !packagePath) {
            log.warn('`package.json` is missing in', packagePath);
            return false;
        }

        const types = findUpKeys(packageJson, 'types')[0] || findUpKeys(packageJson, 'typings')[0];

        if (types) {
            if (typeof types === 'string') return fs.existsSync(path.join(path.dirname(packagePath), types));
            if (typeof types === 'object') {
                return Object.values(types)
                    .filter(tdfile => typeof tdfile === 'string')
                    .some(tdfile => fs.existsSync(path.join(path.dirname(packagePath), tdfile as string)));
            }
        }

        const mainFile = packageJson.main || 'index.js';
        const typingsFile = mainFile.replace(/\.[^.]+$/, '');
        const typingsExts = ['.d.ts', '.d.mts', '.d.cts'];

        return typingsExts.some(ext => fs.existsSync(path.join(path.dirname(packagePath), typingsFile + ext)));
    } catch (error) {
        log.error(error);
        process.exit(1);
    }
}

export default hasOwnTypes;
