var JS_RE = /\.js$/,
    browserify = require('browserify'),
    thunkify = require('thunkify'),
    uglify = require('uglify-js'),
    resolve = require('path').resolve;

module.exports = function (options) {

    options = options || {};
    if ('string' === typeof options) {
        options = {root: options};
    }

    var root = resolve(options.root || '.'),
        isProduction = 'production' in options ? options.production : (process.env.NODE_ENV === 'production'),
        bundleOpts = {
            debug: (!isProduction && options.debug) || false
        },
        hash = {};

    return function* (next) {
        var url = this.originalUrl,
            minify, code;

        if (!JS_RE.test(url)) {
            return yield next;
        }

        if (isProduction && hash[url]) {
            return this.body = hash[url];
        }
        this.type = 'text/javascript';

        var fileName = root + url,
            b = browserify();

        b.add(fileName);

        if (options.runtime) {
			[].concat(options.runtime).forEach(function (file) {
				b.add(file);
			});
        }
        if (options.transform) {
            b.transform(options.transform);
        }

        if (!isProduction) {
            return this.body = b.bundle(bundleOpts);
        }

        try {
            code = yield thunkify(b.bundle.bind(b, bundleOpts))();
            minify = uglify.minify(code, {fromString: true});
            code = minify.code;
        } catch (e) {
            this.status= 500;
            this.body = 'console.error(' + e.stack + ');';
        }

        hash[url] = code;
        this.body = code;

    };

};
