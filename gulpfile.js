var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var path  = require('path');
var del = require('del');
var args = require('yargs').argv;
var objectAssign = require('object-assign');
var KarmaServer = require('karma').Server;
var protractor = require("gulp-protractor").protractor;

var webpack = require('webpack');
var webpackConfig = require('./tools/webpack.config.js');
var history = require('connect-history-api-fallback');
var serverConf = require('./tools/server.conf.js');

var browserSync = require('browser-sync').create();

gulp.task('clean', clean);

gulp.task('build:html', buildHtml);
gulp.task('build:css', buildCss);
gulp.task('build:js', buildJs);
gulp.task('build', gulp.series(
    'clean',
    gulp.parallel(
        'build:html',
        'build:css',
        'build:js'
    )
));

gulp.task('watch:html', watchHtml);
gulp.task('watch:css', watchCss);
gulp.task('watch', gulp.parallel('watch:html', 'watch:css'));

gulp.task('start', gulp.series(
    'build',
    startServer.bind(null, { openBrowser: true })
));

gulp.task('test:unit', testUnit);
gulp.task('test:e2e', gulp.series(
    'build',
    startServer.bind(null, { openBrowser: false }),
    testE2e,
    stopServer
));
gulp.task('test', gulp.parallel(
    'test:unit',
    'test:e2e'
));

gulp.task('release', gulp.series(
    'test',
    'build'
));

gulp.task('dev', gulp.series(
    enableDev,
    'build',
    gulp.parallel(
        'test:unit',
        'watch',
        startServer.bind(null, { openBrowser: true })
    )
));

function clean() {
    return del('dist');
}

function buildHtml() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
}

function buildCss() {
    var options;

    if(!args.dev) {
        options = {
            outputStyle: 'compressed'
        };
    }

    return gulp.src('src/**/*.scss')
        .pipe($.sass(options))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/css'));
}

function buildJs(done) {
    buildVendorsJs();
    buildBundleJs(done);

    function buildVendorsJs() {
        var jsFiles = [
            'node_modules/jquery/dist/jquery.js'
        ];
        var stream = gulp.src(jsFiles)
            .pipe($.concat('vendors.js'));

        if(!args.dev) {
            stream.pipe($.uglify());
        }

        stream.pipe(gulp.dest('dist'));
    }

    function buildBundleJs(done) {
        var build = webpackBuild(done);

        if(!args.dev) {
            webpack(webpackProdConfig(webpackConfig)).run(build);

            return;
        }

        webpack(webpackDevConfig(webpackConfig))
            .watch(100, build);

        function webpackBuild(done) {
            return function(err, stats) {
                if(err) {
                    throw new Error('Build failed');
                }

                done();
            };
        }

        function webpackDevConfig(webpackConfig) {
            return objectAssign(webpackConfig, {
                devtool: 'source-map'
            });
        }

        function webpackProdConfig(webpackConfig) {
            return objectAssign(webpackConfig, {
                plugins: [
                    new webpack.optimize.UglifyJsPlugin()
                ]
            });
        }
    }
}

function watchHtml() {
    gulp.watch('src/**/*.html', gulp.series('build:html'));
}

function watchCss() {
    gulp.watch('src/**/*.scss', gulp.series('build:css'));
}

function testUnit(done) {
    new KarmaServer({
        configFile: path.resolve('./tools/karma.conf.js'),
        singleRun: !args.dev
    }, function(error) {
        if(error) {
            throw new Error('Unit tests failed');
        }
        done();
    }).start();
}

function testE2e() {
    var protractorConf = require('./tools/protractor.conf.js').config;

    return gulp.src(protractorConf.specs)
        .pipe(protractor({
            configFile: './tools/protractor.conf.js'
        }))
        .on('error', function(e) {
            throw new Error('e2e tests failed');
        });
}

function enableDev(done) {
    args.dev = true;
    done();
}

function startServer(config, done) {
    var open = config.openBrowser ? 'local' : false;

    var bsConfig = {
        notify: false,
        open: open,
        port: serverConf.port,
        server: {
            baseDir: './dist',
            middleware: [history()]
        }
    };

    if(args.dev) {
        bsConfig.files = ['dist/**/*.*'];
    } else {
        bsConfig.ui = false;
    }

    browserSync.init(bsConfig, done);
}

function stopServer(done) {
    browserSync.exit();
    done();
}