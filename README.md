koa-browserify
==============

## install
    
    npm i koa-browserify

## example

```js
var app = require('koa')(),
    cjs = require('koa-browserify');

app.use(cjs({
    root: './public', // root folder for js files
    maps: true // show sorcemap
}));

app.use(cjs('./public')) // equivalent to {root: './public'}

app.listen(3000);
```

## production

You can use this module in production by setting option ```production``` or ```env``` variable ```NODE_ENV``` to ```production```

```js
app.use(cjs({
    root: './public',
    maps: true,
    production: true // forse set production mode
}));
```
    
or

    NODE_ENV=production node app.js
