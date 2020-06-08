# Build

The UI is transformed with Babel and built with Webpack.

## Treeshaking

We make use of module treeshaking to try and reduce our bundle size as much as possible. To enable this, the `sideEffects` propery in `package.json` needs to be disabled. If you discover that a file breaks because of the treeshaking, it can be added to the sideEffects array to exclude it. Tree shaking will only occur when in production mode so please check the produciton build for side effects instead of a develpoment build (`npm run build`).

To allow our own modules to be tree-shaken, `modules` has been disabled from `@babel/preset-env` so that webpack can take care of the modules instead.

If you are adding a new module, please try to use one that is in the `ES2015` format instead of `commonjs`. For example, lodash has an `ES2015` alternative module - `lodash-es`. This is because `commonjs` modules cannot be tree-shaken.
