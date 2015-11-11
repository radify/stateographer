import gulp   from 'gulp';
import gif    from 'gulp-if';
import less   from 'gulp-less';
import smaps  from 'gulp-sourcemaps';
import babel  from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import jas    from 'gulp-jasmine';
import conn   from 'gulp-connect';
import yargs  from 'yargs';
import config from './package.json';

const args = yargs.argv, paths = {
  src:      'src/**/*.js',
  build:    'build',
  dist:     'dist',
  specSrc:  'spec/**/*Spec.js',
  specDest: 'build/spec',
  spec:     'build/spec/**/*Spec.js',
  less:     'less/*.less',
  css:      'build/css'
};

const conf = (name, override) => Object.assign(({
  src:  { dest: paths.build },
  spec: { src: paths.specSrc, dest: paths.specDest },
  test: { src: paths.spec, pipe: jas({ includeStackTrace: true }) },
  dist: { dest: paths.dist, file: `${config.build.name}.js`, smaps: true },
  min:  { dest: paths.dist, file: `${config.build.name}.min.js`, min: true, smaps: false }
})[name], override || {});

const pipeline = opts => [gulp.src(opts.src || paths.src)].concat(opts.pipe || [
  gif(!!opts.smaps,   smaps.init()),
  gif(!!opts.modules, babel({ modules: opts.modules })),
  gif(!!opts.file,    concat(opts.file || `${config.build.name}.js`)),
  gif(!!opts.min,     uglify()),
  gif(!!opts.smaps,   smaps.write('.')),
  gulp.dest(opts.dest)
]);
const chain = steps => steps.reduce((prev, step) => prev && prev.pipe(step) || step);
const build = (name, opts) => chain(pipeline(conf(name, opts)));
const bind  = (fn, ...args) => () => fn(...args);

gulp.task('build-src',  bind(build, 'src'));
gulp.task('build-spec', bind(build, 'spec'));
gulp.task('build-less', bind(build, 'spec'));
gulp.task('build-less', () => gulp.src(paths.less).pipe(less()).pipe(gulp.dest(paths.css)));

gulp.task('test', ['build-src', 'build-spec'], bind(build, 'test'));

gulp.task('serve', () => {
  var port = config.build.port;
  return (port) ? conn.server({ root: __dirname, port, livereload: true }) : console.log("Server not configured");
});

gulp.task('dist',    bind(build, args.min ? 'min' : 'dist', Object.assign({ modules: 'common' }, args)));
gulp.task('watch',   gulp.watch.bind(gulp, [paths.src, paths.specSrc, paths.src, paths.less], ['test', 'build-less']));
gulp.task('live',    ['serve', 'watch']);
gulp.task('default', ['test', 'dist']);

gulp.on('err', e => console.log("Gulp error:", e.err.stack));
