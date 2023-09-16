import anyTest, { TestFn } from 'ava';
import getPackageManager from './getPackageManager';
import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import { cyan } from 'ansis/colors';

const test = anyTest as TestFn<{ tempdir: tmp.DirResult; join: (...args: string[]) => string }>;

const tempdir = tmp.dirSync();
const join = path.join.bind(null, tempdir.name);

test.beforeEach((t) => {
    t.context.tempdir = tempdir;
    t.context.join = join;
});

test.afterEach((t) => {
    t.context.tempdir.removeCallback();
});

test(`detects package manager for ${cyan('npm')} if no other package manager was detected`, (t) => {
    const result = getPackageManager(t.context.tempdir.name);

    t.is(result, 'npm');
});

test(`detects package manager for ${cyan('pnpm')}`, (t) => {
    fs.writeFileSync(t.context.join('pnpm-lock.yaml'), '');

    const result = getPackageManager(t.context.tempdir.name);

    t.is(result, 'pnpm');

    fs.unlinkSync(t.context.join('pnpm-lock.yaml'));
});

test(`detects package manager for ${cyan('yarn')}`, (t) => {
    fs.writeFileSync(t.context.join('yarn.lock'), '');

    const result = getPackageManager(t.context.tempdir.name);

    t.is(result, 'yarn');

    fs.unlinkSync(t.context.join('yarn.lock'));
});
