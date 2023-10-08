/* eslint-disable max-len */
import spawn from 'cross-spawn';
import log from 'proc-log';
import { PackageInstallOptions } from '@tdsm/types';

/**
 * Installs dependencies using given package manager.
 * @param {string[]} libraries Dependencies to install, like `['chalk', 'semver']`
 * @param {PackageInstallOptions} options Options for managing the installation process.
 */
function install(libraries: string[], options: PackageInstallOptions = { manager: 'npm', save: ['dev'], types: false }): Promise<void> {
    if (options.types) libraries = libraries.map(library => '@types/' + library);
    log.verbose('Installing following', ...libraries);

    const proc = spawn(options.manager, ['add', ...libraries, ...options.save.map(saveOption => '--save-' + saveOption)], {
        stdio: 'inherit',
    });

    return new Promise(function (resolve, reject) {
        proc.on('close', () => {
            resolve();
        });
        proc.on('error', err => {
            reject(err);
        });
    });
}

export default install;
