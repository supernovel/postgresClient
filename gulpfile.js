var gulp = require('gulp'),
    path = require('upath'),
    ts = require('gulp-typescript'),
    tsProject = ts.createProject('tsconfig.json'),
    through = require('through2');

gulp.task('default', function () {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(through.obj(function (file, enc, cb) {
            var code = file.contents.toString('utf8');
            code = replacePath(
                code, 
                path.normalize(file.history.toString()), 
                tsProject.config.compilerOptions.outDir, 
                tsProject.config.compilerOptions.paths
            );
            file.contents = new Buffer(code);
            this.push(file);
            cb();
        }))
        .pipe(gulp.dest(tsProject.config.compilerOptions.outDir));
});

function replacePath(code, filePath, rootPath, targetPaths) {
    var tscpaths = Object.keys(targetPaths);
    var lines = code.split("\n");
    return lines.map((line) => {
        var matches = [];
        var require_matches = line.match(/require\(('|")(.*)('|")\)/g);
        Array.prototype.push.apply(matches, require_matches);
        if (!matches)
            return line;
        // Walk through every require
        for (var match of matches) {
            // Find each paths
            for (var tscpath of tscpaths) {
                // Find required module & check if its path matching what is described in the paths config.
                var required_modules = match.match(new RegExp(tscpath, "g"));
                if (required_modules && required_modules.length > 0) {
                    for (var required_module of required_modules) {
                        // Get relative path and replace
                        var sourcePath = path.dirname(filePath), targetPath;
                        // module/* --- file/*
                        if (tscpath[tscpath.length - 1] === '*') {
                            targetPath = path.resolve(rootPath + "/" + targetPaths[tscpath].map(_p => _p.replace('/*', '')));

                            var relativePath = path.relative(sourcePath, targetPath);

                            if(relativePath){
                                relativePath = relativePath + '/';
                            }

                            line = line.replace(new RegExp(tscpath.slice(0, -1), "g"), './' + relativePath);
                        }
                        // module -- file
                        else {
                            targetPath = path.resolve(rootPath + "/" + targetPaths[tscpath]);
                            line = line.replace(new RegExp(tscpath, "g"), "./" + path.relative(sourcePath, targetPath));
                        }
                    }
                }
            }
        }
        return line;
    }).join("\n");
}