
module.exports.WebpackPromiseShimPlugin = class WebpackPromiseShimPlugin {

    constructor({ module, key }) {
        this.module = module;
        this.key = key;
    }

    apply(compiler) {
        compiler.options.entry = [].concat(compiler.options.entry);
        compiler.options.entry.unshift(this.module);

        compiler.plugin('compilation', (compilation) => {
            compiler.resolvers.normal.resolve({}, compiler.context, this.module, (err, resource) => {

                if (err) {
                    throw err;
                }

                let promiseModulePath = resource.replace(compiler.context, '.');

                compiler.options.entry = [ compiler.options.entry, resource ];

                compilation.mainTemplate.plugin('bootstrap', (source) => {
                    return `
                        function getPromiseShim() {
                            return __webpack_require__(${ JSON.stringify(promiseModulePath) })[${ JSON.stringify(this.key) }];
                        }

                        function Promise(resolver) {
                            return new (getPromiseShim())(resolver);
                        }

                        Promise.resolve = function(val)      { return getPromiseShim().resolve(val);  };
                        Promise.reject  = function(err)      { return getPromiseShim().reject(err);   };
                        Promise.all     = function(promises) { return getPromiseShim().all(promises); };

                        ${ source }
                    `;
                });
            });
        });
    }
}
