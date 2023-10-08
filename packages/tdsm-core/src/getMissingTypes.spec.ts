import test from 'ava';
import getMissingTypes from './getMissingTypes';
import { PackageJson } from 'read-pkg';
import { Library } from '@tdsm/types';
import { blue } from 'ansis/colors';

test(`detects dependencies that don't have their ${blue('@types')} relatives`, t => {
    const template: PackageJson = {
        name: 'example',
        version: '1.0.0',
        description: 'package.json template',
        main: 'index.js',
        author: 'mrozio13pl',
        dependencies: { hastypes: '^1.0.0', doesnthavetypes: '^0.0.1' },
        devDependencies: { '@types/hastypes': '1.2.3' },
    };

    const expectedResult: Library[] = [{ dependency: 'doesnthavetypes', version: '^0.0.1' }];

    t.deepEqual(getMissingTypes(template), expectedResult);
});
