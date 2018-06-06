var fileinclude = require('gulp-file-include');
var gulp = require('gulp');
var gutil = require('gulp-util');
var insert = require('gulp-insert');
var env = gutil.env.env || 'development';
if (env == 'development') {
    var base = './public_html/';
    var host = 'http://stage.sportsextramile.com';
    var apiHost = 'http://stage.sportsextramile.com/api';
    var gkey = "AIzaSyBMX_8Y8l89UDbLnbewhfXFcRhCs-uzoPQ";
	var doConcat = 0;
} else if (env == 'c9') {
    var base = '/home/ubuntu/workspace/semfront/semfront/';   
    var host = 'http://stage.sportsextramile.com';
    var apiHost = 'http://stage.sportsextramile.com/api';
    var doConcat = 0;
var gkey = "AIzaSyBMX_8Y8l89UDbLnbewhfXFcRhCs-uzoPQ";
} else {
    var base = '/data/semfrontgit/semfrontauto/semfront/';
    var host = 'http://52.220.30.79:8081';
    var apiHost = 'http://52.220.30.79:8081';
}

console.log("running for env " + env);
var path = {
	src:
		{
			img: base + 'src/img/',
                scripts: base + 'src/script/',
                js: base + 'src/js/',
                jslib: base + 'src/js/lib/',
                constants: 'constants.js',
                diag: base + 'src/dialogs/',
                css: base + 'src/css/',
                fonts: base + 'src/fonts/',
                admin: base + 'src/admin/',
                facility: base + 'src/facility/',
                sports: base + 'src/js/sports/',
                sprt: base + 'src/sports/'
		},
    dest:
		{
		img: base + 'build/img/',
                scripts: base + 'build/script/',
                js: base + 'build/js/',
                jslib: base + 'build/js/lib/',
                constants: 'dist/',
                diag: base + 'build/dialogs/',
                css: base + 'build/css/',
                fonts: base + 'build/fonts/',
                admin: base + 'build/admin/',
                facility: base + 'build/facility/',
                sports: base + 'build/js/sports/',
                sprt: base + 'build/sports/'
		}
};

gulp.task('default', function () {
    console.log("default run");
});

gulp.task('copyStatic', function () {
    gulp.src(path.src.js + '*').pipe(gulp.dest(path.dest.js));
    gulp.src(path.src.jslib + '*').pipe(gulp.dest(path.dest.jslib));
    gulp.src(path.src.img + '*').pipe(gulp.dest(path.dest.img));
    gulp.src(path.src.scripts + '*').pipe(gulp.dest(path.dest.scripts));
    gulp.src(path.src.css + '*').pipe(gulp.dest(path.dest.css));
    gulp.src(path.src.diag + '*').pipe(gulp.dest(path.dest.diag));
    gulp.src(path.src.js + '*').pipe(gulp.dest(path.dest.js));
    gulp.src(path.src.fonts + '*').pipe(gulp.dest(path.dest.fonts));
    gulp.src(path.src.sports + '*').pipe(gulp.dest(path.dest.sports));
    gulp.src(path.src.facility + '**/*').pipe(gulp.dest(path.dest.facility));
});

gulp.task('build', ['copyStatic'], function () {
    gulp.src([base + 'src/**/*.html'])
            .pipe(fileinclude({
                prefix: '@@',
                basepath: base + 'src/templates/',
                context : {'host' : host, 'gkey' : gkey, 'doConcat' : doConcat }
            }))
            .pipe(gulp.dest(base + 'build/'));
    gulp.src([path.src.js + 'anghome.js'])
            //.pipe(doYourStuff())
            //.pipe(gulpif(condition, insert.append('# something at the end')))
            .pipe(insert.append("\n.constant('API', '"+ apiHost +"');"))
            .pipe(gulp.dest(path.dest.js));
});

gulp.task('watch', function () {
    gulp.watch(base + 'src/**/*', ['build']);
});