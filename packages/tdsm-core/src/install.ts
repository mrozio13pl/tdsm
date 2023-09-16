import spawn from 'cross-spawn';
import log from 'proc-log';
import { PackageManager, SaveOption } from '@tdsm/types';

/**
 * Installs dependencies using given package manager.
 * @param {string[]} libraries Dependencies to install, like `['chalk', 'semver']`
 * @param {PackageManager} manager Package manager (`npm` | `yarn` | `pnpm`)
 * @param {SaveOption} save Save option (`dev` | `exact` | `optional` | `peer`).
 */
function install(libraries: string[], manager: PackageManager = 'npm', save: SaveOption[] = ['dev']): Promise<void> {
    libraries = libraries.map((library) => '@types/' + library);
    log.verbose('Installing following', ...libraries);

    const proc = spawn(manager, ['add', ...libraries, ...save.map((saveOption) => '--save-' + saveOption)], {
        stdio: 'inherit',
    });

    return new Promise(function (resolve, reject) {
        proc.on('close', () => {
            resolve();
        });
        proc.on('error', (err) => {
            reject(err);
        });
    });
}

export default install;
