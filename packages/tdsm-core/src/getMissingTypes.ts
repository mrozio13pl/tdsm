import { PackageJson } from 'read-pkg';
import { Library } from '@tdsm/types';

/**
 * Checks dependencies in `package.json` file and returns dependencies that don't have their relatives with `@types`
 * @param {PackageJson} pkg A `package.json` object.
 * @returns {Library[]} Libraries with missing types.
 */
function getMissingTypes(pkg: PackageJson): Library[] {
    const deps = Object.keys(pkg.dependencies || {});
    const devDeps = Object.keys(pkg.devDependencies || {});
    const typesDeps = [...deps, ...devDeps].filter(dependency => dependency.startsWith('@types/'));

    return deps
        .filter(dependency => !dependency.startsWith('@types/') && !typesDeps.includes('@types/' + dependency))
        .map(dependency => ({
            dependency,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            version: (pkg.dependencies?.[dependency])!,
        }));
}

export default getMissingTypes;
