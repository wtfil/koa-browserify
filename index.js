var JS_RE = /\.js$/,
    browserify = require('browserify'),
    thunkify = require('thunkify'),
    resolve = require('path').resolve;

module.exports = function (options) {

    options = options || {};
    if ('string' === typeof options) {
        options = {root: options};
    }

    var root = resolve(options.root || '.');
    
    return function* (next) {

        if (!JS_RE.test(this.originalUrl)) {
            return yield next;
        }

        var fileName = root + this.originalUrl,
            b = browserify();

        b.add(fileName);

        try {
            this.body = yield thunkify(b.bundle.bind(b))();
        } catch (e) {
            this.status= 500;
            this.body = e.stack;
        }

    };

};
