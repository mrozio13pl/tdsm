import test from 'ava';
import hasAtTypes from './hasAtTypes';
import { blue } from 'ansis/colors';

test('checks if packages have typescript declarations provided by ' + blue('@types'), async t => {
    t.true(await hasAtTypes('nice-try'));
    t.true(await hasAtTypes('read-pkg')); // even if they are deprecated
    t.false(await hasAtTypes('miniget'));
});
