import ansis, { Ansis } from 'ansis';

/**
 * Whether debug logs are enabled. Default is `false`.
 */
// eslint-disable-next-line prefer-const
let shouldDebug = false;

const colors: Record<string, Ansis> = {
    VERBOSE: ansis.magenta,
    INFO: ansis.greenBright,
    WARN: ansis.yellow,
    ERROR: ansis.red,
    NOTICE: ansis.white,
    SILLY: ansis.white,
    HTTP: ansis.white,
    DEBUG: ansis.magentaBright,
};

process.on('log', function (level: string, ...args) {
    // temp: mark level `verbose` as debug
    if (level === 'verbose' && !shouldDebug) return;
    console.log(colors[level.toUpperCase()](level), args.join(' '));
});

function log(...args: string[]) {
    console.log(args.join(' '));
}
function info(...args: string[]) {
    console.log(colors.INFO('INFO'), args.join(' '));
}
function warn(...args: string[]) {
    console.log(colors.WARN('WARN'), args.join(' '));
}
function error(...args: string[]) {
    console.log(colors.ERROR('ERROR'), args.join(' '));
}
function debug(...args: string[]) {
    console.log(colors.DEBUG('DEBUG'), args.join(' '));
}

export default { log, info, warn, error, debug, shouldDebug };
