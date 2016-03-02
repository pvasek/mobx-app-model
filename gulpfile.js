var gulp = require("gulp");
var fs = require("fs");
var del = require("del");
var ts = require('gulp-typescript');
var shell = require('gulp-shell')
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('clean', function () {
    return del([
        './temp/ts/**/*'
    ]);
});

gulp.task('ts', ['clean'], shell.task([
    'tsc'
]));

gulp.task('test:watch', ['test'], function() {
    gulp.watch(['**/*.ts'], ['test']);
});

gulp.task('test:debug', ['ts'], shell.task([
  'mocha --debug-brk ./temp/ts/**/**/__tests__/*.js',
], { ignoreErrors: true }));

gulp.task('test', ['ts'], shell.task([
  'mocha ./temp/ts/**/**/__tests__/*.js',
], { ignoreErrors: true }));
