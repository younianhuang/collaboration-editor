import { src, dest, series } from 'gulp';
import insert from 'gulp-insert';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import cleanCSS from 'gulp-clean-css';
import header from 'gulp-header';
import trim from 'trim';
import filter from 'gulp-filter-each';
import fs from 'fs';
import gulpTypescript from 'gulp-typescript';
import typescript from 'typescript';

const tsProject = gulpTypescript.createProject('tsconfig.json', {
  declaration: true,
  typescript: typescript,
});

const exportFilter = 'export {};';

const typeBuild = () => {
  const outputPath = 'dist';

  const packageJson = JSON.parse(fs.readFileSync('./package.json'));
  const headerTxt = fs.readFileSync('./copyright-header.txt');

  return src('./src/ts/index.ts')
    .pipe(webpackStream(require('./configs/webpack.config.type.prod.js/index.js'), webpack))
    .pipe(header(headerTxt, { package: packageJson }))
    .pipe(dest(outputPath));
};

const commonjs = () =>
  src('./src/ts/*.ts', { allowEmpty: true }).pipe(babel()).pipe(dest('dist'));

const typings = () =>
  src('src/ts/*.ts', { allowEmpty: true })
    .pipe(tsProject())
    .dts.pipe(filter(content => trim(content) !== exportFilter))
    .pipe(dest('dist/typings'));

const appendTypingsNamespace = () =>
  src('dist/typings/index.d.ts', { base: './' })
    .pipe(insert.append('\nexport as namespace MonacoCollobFronend;\n'))
    .pipe(dest('./'));

const css = () => src('src/css/*.css').pipe(dest('dist/css'));

const clean = () => del(['dist']);

const copyFiles = () =>
  src(['README.md', 'LICENSE', 'package.json']).pipe(dest('dist'));

const copyDocs = () =>
  src(['docs/**/*'], { allowEmpty: true }).pipe(dest('dist/docs'));

const dist = series([
  typeBuild,
  commonjs,
  typings,
  appendTypingsNamespace,
  css,
  copyFiles,
  copyDocs,
]);

export { dist, clean };
