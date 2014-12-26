var gulp = require('gulp'),
    config = require('./config');
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    });

var runSequence = require('run-sequence');
var extend = require('extend');
$.browser = require('browser-sync');

var DEFAULT_OPTIONS = {
    min: false,
    d: config.defaultDir || ''
};
var APP_PATH = config.appPath;
var OPTIONS = parseOption(process.argv);
function parseOption(argv) {
    var options = extend({},DEFAULT_OPTIONS);
    for(var i = 0, len = argv.length; i < len; i++) {
        if (argv[i].charAt(0) === '-') {
            var match = argv[i].substring(1).split('=');
            var key = match[0];
            var value = match[1] || true;
            options[key] = value;
        }
    }
    return options;
}


/**
 * パス生成関数
 * @param name
 * @param prop
 * @returns {string}
 */
function getPath(name, prop) {
    prop = prop || 'src';
    if (!config.path[name] || !config.path[name][prop]) {
        return console.log('[ERROR] not found path - ' + name + '.' + prop);
    }
    var path = config.path[name][prop];
    if (typeof path === 'object') {
        return path.map(function (val) {
            if (val.charAt(0) === '!') {
                return '!' + APP_PATH + '/' + replaceTypeTag(val.substring(1));
            }
            return APP_PATH + '/' + replaceTypeTag(val);
        });
    } else {
        path = path || '';
        return APP_PATH + '/' + replaceTypeTag(path);
    }
}
function replaceTypeTag(val) {
    if (OPTIONS.d) {
        return val.replace(/%type%/g, OPTIONS.d);
    }
    return val.replace(/\/%type%/g, '');
}

// globalに共通変数書き出し
global.frontplate = {
    plugins: $,
    config: config,
    getPath: getPath,
    option: OPTIONS
};

gulp.task('watch', function() {
    gulp.watch(getPath('ejs','watch'), ['ejs']);
    gulp.watch(getPath('sass'), ['style']);
    gulp.watch(getPath('sprite','watch'), ['sprite']);
    gulp.watch(getPath('images'), ['imagemin']);
});

// gulpディレクトリのタスク読み込み
var tasks = require('./gulp/load');
gulp.task('build',['clean'], function(callback) {
    return runSequence(['ejs', 'style', 'imagemin', 'script'], callback);
});
gulp.task('default',['server','watch','watchScript'], function() {});