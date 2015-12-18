'use strict';
/**
 * サーバー起動タスク
 */
let gulp = require('gulp');
let _ = require('lodash');
let rewrite = require('connect-modrewrite');
let config = require('./config');
let $ = require('./plugins');

gulp.task('server', () => {
    let options = _.merge(config.server, {
        server: {
            baseDir: config.dist,
            directory: false,
            middleware: [
                rewrite([
                    '^[^\\.]*$ /index.html [L]'
                ])
            ]
        },
        notify: false
    });
    if (options.proxy) {
        delete options.server;
    }
    return $.browser(options);
});
gulp.task('reload', () => {
    $.browser.reload();
});
