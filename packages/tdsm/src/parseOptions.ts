import { getPackageManager } from '@tdsm/core';
import { Options } from '@tdsm/types';
import defu from 'defu';

/**
 * Parses options with default values.
 * @param {Partial<Options>} options Options.
 * @returns {Options} Options with default values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseOptions(options: Options & any = {}): Options {
    options.save = [];

    // manager shortcuts
    if (options.dev) options.save.push('dev');
    if (options.peer) options.save.push('peer');
    if (options.optional) options.save.push('optional');
    if (options.bundle) options.save.push('bundle');
    if (options.exact) options.save.push('exact');

    // rename some variables
    options.disableCache = options['no-cache'];
    options.builtins = options['built-ins'];

    return defu(options, {
        manager: getPackageManager(),
        save: !options.save.length && ['dev'],
        ignore: [],
        disableCache: false,
        pkgDir: process.cwd(),
        debug: false,
        builtins: false,
    } as Options);
}

export default parseOptions;
