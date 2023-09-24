import resolveVersion from 'resolve-version';
import { Library } from '@tdsm/types';

export const formatLibraryVersion = function (lib: Library): string {
    const version = resolveVersion.local(lib.dependency, { silent: true }) || lib.version;

    return version ? '@' + version : '';
};
