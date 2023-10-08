import { existsSync } from 'fs';
import { resolve } from 'path';
import { PackageManager } from '@tdsm/types';

/**
 * Automatically detects package manager in a directory.
 * @param {string} cwd Current working directory where `package.json` should be located. (Default: `process.cwd()`)
 * @returns {PackageManager}
 */
function getPackageManager(cwd: string = process.cwd()): PackageManager {
    if (existsSync(resolve(cwd, 'yarn.lock'))) return 'yarn';
    if (existsSync(resolve(cwd, 'pnpm-lock.yaml')) || existsSync(resolve(cwd, './node_modules/.pnpm'))) return 'pnpm';
    return 'npm';
}

export default getPackageManager;
