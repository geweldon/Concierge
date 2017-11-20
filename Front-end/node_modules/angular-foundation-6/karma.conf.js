let expand = require('glob-expand');
let util = require('util');

module.exports = function(config) {

config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '.',

    frameworks: ['jspm', 'jasmine'],

    preprocessors: {
        'src/**/*': ['generic', 'babel'],
    },

    babelPreprocessor: {
        options: {
            sourceMap: 'inline',
            plugins: ['transform-es2015-modules-systemjs'],
            presets: ['es2015'],
        },
    },

    // list of files / patterns to load in the browser
    files: [
        'misc/test-lib/helpers.js',
    ],

    // list of files to exclude
    exclude: [
        'src/**/demo.js',
    ],

    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox'],
        },
    },

    browsers: [
        'Chrome', 'Firefox',
    ],

    // test results reporter to use
    // possible values: dots || progress
    reporters: ['progress'],

    // web server port
    port: 9876,

    // cli runner port
    // runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // autoWatch: false,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    genericPreprocessor: {
        rules: [{
            match: 'src/**/*.html',
            process: (content, file, done, log) => {
                const escapeContent = (content) => content
                    .replace(/\\/g, '\\\\')
                    .replace(/'/g, '\\\'')
                    .replace(/\r?\n/g, '\\n\' +\n        \'');

                const template = `
                    import angular from "angular";
                    angular.module('%s', []).run(['$templateCache', function($templateCache) {
                        $templateCache.put('%s', '%s');
                    }]);
                    `;

                const filepath = file.originalPath.replace(`${config.basePath}/`, '');
                const cacheId = filepath.replace('src/', 'template/');
                const htmlPath = filepath.replace('src/', 'template/');

                file.path = `${file.originalPath}.js`;
                file.originalPath = file.path;
                try {
                    done(util.format(template, htmlPath, htmlPath, escapeContent(content)));
                } catch (e) {
                    log.error('%s\n    at %s', e.message, file.originalPath);
                }
            },
        }],
    },

    jspm: {
        // Edit this to your needs
        serveFiles: ['jspm_packages/**/*.js', 'src/**/*.html', 'src/**/*.js'],
        loadFiles: expand(['src/**/*.spec.js', '!src/_*/**']),
        config: 'config.js',
        packages: 'jspm_packages/',
    },
});
};
