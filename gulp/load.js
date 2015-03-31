var fs = require('fs'),
    path = require('path');

module.exports = function() {
    // gulpディレクトリにあるタスクをロード
    var files = fs.readdirSync(__dirname),
        result = [];

    files.forEach(function(file) {
        var stats = fs.statSync(path.join(__dirname,file));
        if (stats.isFile() && path.extname(file) === '.js') {
            var name = path.basename(file,'.js');
            if (name === 'load') return;
            result[name] = require(__dirname + '/'+name);
        }
    });
    return result;
}();