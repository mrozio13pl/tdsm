import path from 'path';
import semver from 'semver';
import jsonfile from 'jsonfile';
import findCacheDirectory from 'find-cache-dir';
import log from 'proc-log';
import { CacheInfo, CacheOptions, Library } from '@tdsm/types';

/**
 * Cache file manager.
 */
class CacheFile {
    /**
     * Path to cache directory.
     */
    private readonly path: string;
    /**
     * Path to cache file.
     */
    private readonly file: string;
    /**
     * Data stored in a cache file.
     */
    private data = new Array<CacheInfo>();

    /**
     * Initialize the cache file.
     */
    constructor() {
        this.path = findCacheDirectory({ name: 'tdsm', create: true })!;
        this.file = path.join(this.path, 'cache.json');

        if (!this.path) {
            log.error('Couldn\'t create a cache file');
            return;
        }

        this.read();
    }

    /**
     * Checks if a library is already in a cache file.
     * @param {Library} lib Library to check
     * @returns {boolean}
     */
    has(lib: Library): boolean {
        return this.data.some(
            ({ dependency, version }) => lib.dependency === dependency && semver.intersects(lib.version, version),
        );
    }

    /**
     * Looks for a library in a cache file.
     * @param {Library} lib Library to find
     * @returns
     */
    find(lib: Library): CacheInfo | undefined {
        return this.data.find(
            _lib => lib.dependency === _lib.dependency && semver.intersects(lib.version, _lib.version),
        );
    }

    /**
     * Deletes a library from cache data.
     * @param {Library} lib Library to delete.
     */
    delete(lib: Library): void {
        const item = this.find(lib);
        this.data = this.data.filter(_lib => _lib === item);
    }

    /**
     * Reads a cache file and stores data in memory.
     */
    read(): void {
        this.data = jsonfile.readFileSync(this.file, { throws: false }) || [];
    }

    /**
     * Saves data in a cache file.
     */
    save(): void {
        jsonfile.writeFileSync(this.file, this.data);
    }

    /**
     * Adds a library to a cache file.
     * @param {Library} library Library to add.
     * @param {CacheOptions} options (optional)
     */
    push(library: Library, options: CacheOptions = {}): void {
        if (this.has(library)) this.delete(library);

        options = {
            ignore: true,
            hasOwnTypes: false,
            hasAtTypes: false,
            ...options,
        };

        this.data.push({ ...library, ...options });
    }

    /**
     * Returns data from a cache file.
     */
    get getData(): CacheInfo[] {
        return this.data;
    }
}

export default function cachefile() {
    return new CacheFile();
}
