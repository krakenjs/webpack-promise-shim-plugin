# Webpack Promise Shim Plugin

## The problem

Webpack, in generated builds, uses promises for things like lazy-loading, chunking, etc.

Problem is, it relies on `window.Promise` being set, which ain't the case in IE or other older browsers. You can polyfill `window.Promise`, but that's a bad idea if you're trying to run on 3rd party domains you don't own.

This plugin allows you to specify your own promise polyfill for webpack to use, without shimming `window.Promose`

## Install

```bash
npm install --save-dev webpack-promise-shim-plugin
```

## Use

```javascript
const { WebpackPromiseShimPlugin } = require('webpack-promise-shim-plugin');

...

plugins: [
    new WebpackPromiseShimPlugin({
        module: 'zalgo-promise/src',
        key:    'ZalgoPromise'
    }),
]
```

## Notes

- Only testing with Webpack 3, your mileage may very on other versions
- Only works right now in conjunction with `webpack.NamedModulesPlugin`
