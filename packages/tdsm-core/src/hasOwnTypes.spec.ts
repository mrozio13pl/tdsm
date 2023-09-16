import test from 'ava';
import hasOwnTypes from './hasOwnTypes';

test('checks if packages have typescript declarations built-in', (t) => {
    t.true(hasOwnTypes('read-pkg'));
    t.false(hasOwnTypes('eslint'));
});
