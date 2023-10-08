import readPkg, { PackageJson } from 'read-pkg';
import { GetPackageJsonOptions } from '@tdsm/types';
import log from 'proc-log';

/**
 * Reads `package.json` from given path.
 * @param {GetPackageJsonOptions} options Options.
 * @returns {PackageJson} `package.json` object
 */
function getPackageJson(options: GetPackageJsonOptions = {}): PackageJson | undefined {
    const { path = process.cwd(), normalize = false } = options;

    try {
        return readPkg.sync({ cwd: path, normalize });
    } catch (error) {
        log.error(error);
        return undefined;
    }
}

export default getPackageJson;
