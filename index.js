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
            debug: (!isProduction && options.maps) || false
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

        var fileName = root + url,
            b = browserify();

        b.add(fileName);

        try {
            code = yield thunkify(b.bundle.bind(b, bundleOpts))();
        } catch (e) {
            this.status= 500;
            this.body = e.stack;
        }

        if (isProduction) {
            try {
                minify = uglify.minify(code, {fromString: true});
                console.log(minify);
                code = minify.code;
            } catch(e) {
                console.log(e.stack);
            }

            hash[url] = code;
        }

        this.body = code;

    };

};
