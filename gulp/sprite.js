/**
 * スプライト生成タスク
 * スプライト画像とCSSを生成するタスク
 */
var gulp = require('gulp'),
    _ = require('lodash'),
    path = require('path'),
    ms = require('merge-stream'),
    fs = require('fs'),
    ejs = require('ejs'),
    config = global.config;

module.exports = function () {
    gulp.task('sprite',function() {
        var op = _.extend({},__CONFIG.sprite.options);
        var template = op.cssTemplate;
        if (typeof template === 'string' && path.extname(template) === '.ejs') {
            var file = fs.readFileSync(process.cwd() + '/' + template);
            op.cssTemplate = function(data) {
                return ejs.render(file.toString(),data);
            };
        }
        return gulp.src(__CONFIG.path.sprite.src)
            .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
            .pipe($.foreach(function(stream, file){
                if(file.isDirectory()) {
                    var paths = file.path.split(path.sep);
                    var name = paths.pop();
                    if (!name) return stream;
                    var isRetina = name.search(/-2x$/) !== -1;
                    var options = _.merge({
                        cssSpritesheetName: name,
                        imgName: name + __CONFIG.sprite.imgExtension,
                        cssName: '_' + name + __CONFIG.sprite.cssExtension,
                        imgPath: __CONFIG.path.sprite.imagePath + '/' + name + __CONFIG.sprite.imgExtension,
                        cssOpts: {
                            scale: isRetina ? .5 : 1,
                            prefix: name,
                            functions: true
                        }
                    },op);
                    var strm = gulp.src(file.path + '/*' + __CONFIG.sprite.extension)
                        .pipe($.plumber())
                        .pipe($.spritesmith(options));
                    strm.img.pipe(gulp.dest(__CONFIG.path.sprite.imageDest));
                    strm.css.pipe(gulp.dest(__CONFIG.path.sprite.cssDest));
                    return ms(stream,strm);
                }
                return stream;
            }));
    });
}();
