// Types for tdsm.

/**
 * Package manager (`npm` | `yarn` | `pnpm`).
 */
export declare type PackageManager = 'npm' | 'yarn' | 'pnpm';

/**
 * Save option (`dev` | `optional` | `peer` | `bundle` | `exact`).
 * @link https://docs.npmjs.com/cli/v10/commands/npm-install
 */
export declare type SaveOption = 'dev' | 'optional' | 'peer' | 'exact' | 'bundle';

/**
 * Essential options.
 */
export declare interface Options {
    /**
     * Allows you to set a package manager you want `@types` to be installed with.
     * @type {string} Package manager.
     * @default {PackageManager} Automatically detects package manager you are using in current directory.
     */
    manager: PackageManager;
    /**
     * Save options for installing `@types` packages (`dev`|`exact`|`optional`|`peer`).
     * @type {SaveOption} Save option.
     * @default dev
     * @example ```bash
     * npm i --dev @types/has
     * ```
     */
    save: SaveOption[];
    /**
     * List of dependencies to ignore.
     * @type {Array} Ignored dependencies.
     */
    ignore: string[];
    /**
     * Whether should check built-in modules.
     * @type {boolean}
     * @default false 
     */
    builtins: boolean;
    /**
     * Disables cache file in `./node_modules/.cache/tdsm` and doesn't store any data.
     * @type {boolean}
     * @default false
     */
    disableCache: boolean;
    /**
     * Allows you to set a path to `package.json`.
     * @type {string} Path to `package.json`.
     */
    pkgDir: string;
    /**
     * Displays additional info.
     * @type {boolean} Debug.
     * @default false
     */
    debug: boolean;
}

export declare interface Library {
    dependency: string;
    version: string;
}

export declare interface CacheInfo extends Library {
    ignore?: boolean;
    hasOwnTypes?: boolean;
    hasAtTypes?: boolean;
}

export declare interface CacheOptions {
    ignore?: boolean;
    hasOwnTypes?: boolean;
    hasAtTypes?: boolean;
}

export declare interface GetPackageJsonOptions {
    path?: string;
    normalize?: boolean;
}

export declare interface PackageInstallOptions {
    save: SaveOption[];
    manager: PackageManager;
    /**
     * Should the packages be installed with `@types/` prefix.
     * @default false
     */
    types: boolean;
}