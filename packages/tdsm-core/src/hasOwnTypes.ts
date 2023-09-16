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
function hasOwnTypes(dependency: string): boolean {
    try {
        const moduleDir = path.join(process.cwd(), 'node_modules', dependency);
        const { packageJson, path: packagePath } = readPkgUp.sync({ cwd: moduleDir }) || {};

        if (!packageJson || !packagePath) {
            log.warn('`package.json` is missing in', packagePath);
            return false;
        }

        const types = findUpKeys(packageJson, 'types')[0] || findUpKeys(packageJson, 'typings')[0];

        if (types) return fs.existsSync(path.join(path.dirname(packagePath), types));

        const mainFile = packageJson.main || 'index.js';
        const typingsFile = mainFile.replace(/\.[^.]+$/, '');
        const typingsExts = ['.d.ts', '.d.mts', '.d.cts'];

        return typingsExts.some((ext) => fs.existsSync(path.join(path.dirname(packagePath), typingsFile + ext)));
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
}

export default hasOwnTypes;
