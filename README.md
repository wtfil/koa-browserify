koa-browserify
------------

middleware for ```koa.js``` that compile CommonJS modules

## install
    
    npm i koa-browserify

## example

```js
var app = require('koa')(),
    browserify = require('koa-browserify');

app.use(browserify({
    root: './public', // root folder for js files
    debug: true // show sorcemap
}));

app.use(browserify('./public')) // equivalent to {root: './public'}

app.listen(3000);
```

## options

* ```root``` root folder for scripts
* ```debug``` enable soucemaps
* ```production``` enable production mode. In production soucemaps not working and code is minified
* ```transform``` you can transform original souce with this option. This options should be a function, that will be called with tr(file) and it should return a through-stream that takes the raw file contents and produces the transformed source.
* ```runtime``` you can add adition runtime sources by passing this option

this code will compile ```jsx``` files to ```js``` code

```js
var browserify = require('koa-browserify'),
    reactify = require('reactify');

app.use(browserify({
    root: './public',
    transform: reactify,
}));
```

or

```js
var browserify = require('koa-browserify'),
    6to5ify = require('6to5ify');

app.use(browserify({
    root: './public',
    transform: 6to5ify,
    runtime: require.resolve('regenerator/runtime')
}));
```

## production

You can use this module in production by setting option ```production``` or ```env``` variable ```NODE_ENV``` to ```production```

```js
app.use(browserify({
    root: './public',
    debug: true,
    production: true // forse set production mode
}));
```
    
or

    NODE_ENV=production node app.js
