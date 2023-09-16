import get from 'simple-get';
import log from 'proc-log';

const REGISTRY = 'https://registry.npmjs.org/';

/**
 * Checks whether a dependency has typings provided by DefinitelyTyped (**@types/package-name**).
 * @param {string} dependency Dependency, e.g. `chalk`
 * @param {number} timeout Optional, timeout for a http request.
 * @returns {Promise<boolean>}
 */
function hasAtTypes(dependency: string, timeout: number = 5000): Promise<boolean> {
    return new Promise(function (resolve, reject) {
        get({ url: new URL('@types/' + dependency.replace(/\//g, '__'), REGISTRY).href, timeout }, function (err, res) {
            if (err) {
                log.error(err);
                reject(err);
            }

            if (res?.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

export default hasAtTypes;
