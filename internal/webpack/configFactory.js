import path from 'path';
import appRootDir from 'app-root-dir';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import webpack from 'webpack';
import WebpackMd5Hash from 'webpack-md5-hash';

import config from '../../config';
import { happyPackPlugin } from '../utils';
import { ifElse } from '../../shared/utils/logic';
import { mergeDeep } from '../../shared/utils/objects';
import { removeNil } from '../../shared/utils/arrays';
import withServiceWorker from './withServiceWorker';


/**
 * Generates a webpack configuration for the target configuration.
 *
 * This function has been configured to support one "client/web" bundle, and any
 * number of additional "node" bundles (e.g. our "server").  You can define
 * additional node bundles by editing the project confuguration.
 *
 * @param  {Object} buildOptions - The build options.
 * @param  {target} buildOptions.target - The bundle target (e.g 'clinet' || 'server').
 * @param  {target} buildOptions.optimize - Build an optimised version of the bundle?
 *
 * @return {Object} The webpack configuration.
 */
export default function webpackConfigFactory(buildOptions) {
  const { target, optimize = false } = buildOptions;

  const isProd = optimize;
  const isDev = !optimize;
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isNode = !isClient;

  // Preconfigure some ifElse helper instnaces. See the util docs for more
  // information on how this util works.
  const ifDev = ifElse(isDev);
  const ifProd = ifElse(isProd);
  const ifNode = ifElse(isNode);
  const ifClient = ifElse(isClient);
  const ifDevClient = ifElse(isDev && isClient);
  const ifProdClient = ifElse(isProd && isClient);

  console.log(`==> Creating ${isProd ? 'an optimised' : 'a development'} bundle configuration for the "${target}"`);

  const bundleConfig = isServer || isClient
    // This is either our "server" or "client" bundle.
    ? config(['bundles', target])
    // Otherwise it must be an additional node bundle.
    : config(['additionalNodeBundles', target]);

  if (!bundleConfig) {
    throw new Error('No bundle configuration exists for target:', target);
  }

  let webpackConfig = {
    // Define our entry chunks for our bundle.
    entry: {
      // We name our entry files "index" as it makes it easier for us to
      // import bundle output files (e.g. `import server from './build/server';`)
      index: removeNil([
        // Required to support hot reloading of our client.
        ifDevClient(() => `webpack-hot-middleware/client?reload=true&path=http://${config('host')}:${config('clientDevServerPort')}/__webpack_hmr`),
        // We are using polyfill.io instead of the very heavy babel-polyfill.
        // Therefore we need to add the regenerator-runtime as polyfill.io
        // doesn't support this.
        ifClient('regenerator-runtime/runtime'),
        // The source entry file for the bundle.
        path.resolve(appRootDir.get(), bundleConfig.srcEntryFile),
      ]),
    },

    // Bundle output configuration.
    output: {
      // The dir in which our bundle should be output.
      path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
      // The filename format for our bundle's entries.
      filename: ifProdClient(

        '[name]-[chunkhash].js',

        '[name].js',
      ),
      // The name format for any additional chunks produced for the bundle.
      chunkFilename: '[name]-[chunkhash].js',
      // When targetting node we will output our bundle as a commonjs2 module.
      libraryTarget: ifNode('commonjs2', 'var'),
      // This is the web path under which our webpack bundled client should
      // be considered as being served from.
      publicPath: ifDev(
        // As we run a seperate development server for our client and server
        // bundles we need to use an absolute http path for the public path.
        `http://${config('host')}:${config('clientDevServerPort')}${config('bundles.client.webPath')}`,
        // Otherwise we expect our bundled client to be served from this path.
        bundleConfig.webPath,
      ),
    },

    target: isClient
      // Only our client bundle will target the web as a runtime.
      ? 'web'
      // Any other bundle must be targetting node as a runtime.
      : 'node',

    node: {
      __dirname: true,
      __filename: true,
    },

    // Source map settings.
    devtool: ifElse(

        isNode
        // Always include source maps for any development build.
        || isDev
        // Allow for the following flag to force source maps even for production
        // builds.
        || config('includeSourceMapsForOptimisedClientBundle'),
      )(
      // Produces an external source map (lives next to bundle output files).
      'source-map',
      // Produces no source map.
      'hidden-source-map',
    ),

    // Performance budget feature.
    // This enables checking of the output bundle size, which will result in
    // warnings/errors if the bundle sizes are too large.
    // We only want this enabled for our production client.  Please
    // see the webpack docs on how you can configure this to your own needs:
    // https://webpack.js.org/configuration/performance/
    performance: ifProdClient(
      // Enable webpack's performance hints for production client builds.
      { hints: 'warning' },
      // Else we have to set a value of "false" if we don't want the feature.
      false,
    ),

    resolve: {
      // These extensions are tried when resolving a file.
      extensions: config('bundleSrcTypes').map(ext => `.${ext}`),

      // This is required for the modernizr-loader
      // @see https://github.com/peerigon/modernizr-loader
      alias: mergeDeep(
        // For our optimised builds we will alias to the optimised versions
        // of React and ReactDOM.
        ifProd({
          react$: path.resolve(
            appRootDir.get(), './node_modules/react/dist/react.min.js',
          ),
          'react-dom$': path.resolve(
            appRootDir.get(), './node_modules/react-dom/dist/react-dom.min.js',
          ),
          'react-dom/server$': path.resolve(
            appRootDir.get(), './node_modules/react-dom/dist/react-dom-server.min.js',
          ),
        }),
      ),
    },

    externals: removeNil([
      ifNode(
        () => nodeExternals(

          {
            whitelist:
              removeNil([
                // We always want the source-map-support included in
                // our node target bundles.
                'source-map-support/register',

                ifProd('react'),
                ifProd('react-dom'),
                ifProd('react-dom/server'),
              ])
              // And any items that have been whitelisted in the config need
              // to be included in the bundling process too.
              .concat(config('nodeExternalsFileTypeWhitelist') || []),
          },
        ),
      ),
    ]),

    plugins: removeNil([

      ifNode(() => new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false,
      })),
      new webpack.ProvidePlugin({
        // make fetch available
        fetch: 'exports-loader?self.fetch!whatwg-fetch',
      }),

      ifClient(() => new WebpackMd5Hash()),

      new webpack.DefinePlugin({
        // Is this the "client" bundle?
        'process.env.BUILD_FLAG_IS_CLIENT': JSON.stringify(isClient),
        // Is this the "server" bundle?
        'process.env.BUILD_FLAG_IS_SERVER': JSON.stringify(isServer),
        // Is this a node bundle?
        'process.env.BUILD_FLAG_IS_NODE': JSON.stringify(isNode),
        // Is this a development build?
        'process.env.BUILD_FLAG_IS_DEV': JSON.stringify(isDev),
      }),
      ifClient(() =>
        new AssetsPlugin({
          filename: config('bundleAssetsFileName'),
          path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
        }),
      ),

      // We don't want webpack errors to occur during development as it will
      // kill our dev servers.
      ifDev(() => new webpack.NoEmitOnErrorsPlugin()),

      // We need this plugin to enable hot reloading of our client.
      ifDevClient(() => new webpack.HotModuleReplacementPlugin()),

      ifProdClient(
        () => new webpack.LoaderOptionsPlugin({
          minimize: true,
        }),
      ),


      ifProdClient(
        () => new webpack.optimize.UglifyJsPlugin({
          sourceMap: config('includeSourceMapsForOptimisedClientBundle'),
          compress: {
            screw_ie8: true,
            warnings: false,
          },
          mangle: {
            screw_ie8: true,
          },
          output: {
            comments: false,
            screw_ie8: true,
          },
        }),
      ),

      // For the production build of the client we need to extract the CSS into
      // CSS files.
      ifProdClient(
        () => new ExtractTextPlugin({
          filename: '[name]-[chunkhash].css', allChunks: true,
        }),
      ),

      happyPackPlugin({
        name: 'happypack-javascript',
        // We will use babel to do all our JS processing.
        loaders: [{
          path: 'babel-loader',

          query: config('plugins.babelConfig')(
            {
              babelrc: false,
              cacheDirectory: true,
              presets: [
                'react',
                'stage-3',
                ifClient(['latest', { es2015: { modules: false } }]),
                ifNode(['env', { targets: { node: true }, modules: false }]),
              ].filter(x => x != null),

              plugins: [
                'transform-decorators-legacy',
                  ['transform-class-properties', { spec: true }],
                  ['transform-object-rest-spread', { useBuiltIns: true }],
                ifClient(['transform-react-jsx', { useBuiltIns: true }]),
                'transform-flow-strip-types',
                ifClient('dynamic-import-webpack'),
                ifNode('dynamic-import-node'),
                ifDev('transform-react-jsx-self'),
                ifDev('transform-react-jsx-source'),
                ifProd('transform-react-inline-elements'),
                ifProd('transform-react-constant-elements'),
              ].filter(x => x != null),
            },
            buildOptions,
          ),
        }],
      }),

      // HappyPack 'css' instance for development client.
      ifDevClient(
        () => happyPackPlugin({
          name: 'happypack-devclient-css',
          loaders: [
            { path: 'style-loader' },
            {
              path: 'css-loader',
              use: {
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                sourceMap: true,
                modules: true,
              },
            },
            {
              path: 'postcss-loader',
            },
            {
              path: 'sass-loader',
              use: {
                outputStyle: 'expanded',
                sourceMap: true,
              },
            },
          ],
        }),
      ),

      // END: HAPPY PACK PLUGINS
      // -----------------------------------------------------------------------
    ]),
    module: {
      rules: removeNil([
        // JAVASCRIPT
        {
          test: /\.jsx?$/,
          loader: 'happypack/loader?id=happypack-javascript',
          include: removeNil([
            ...bundleConfig.srcPaths.map(srcPath =>
              path.resolve(appRootDir.get(), srcPath),
            ),
            ifProdClient(path.resolve(appRootDir.get(), 'src/html')),
          ]),
        },
        ifElse(isClient || isServer)(
          mergeDeep(
            {
              test: /(\.scss|\.css)$/,
            },
            // For development clients we will defer all our css processing to the
            // happypack plugin named "happypack-devclient-css".
            // See the respective plugin within the plugins section for full
            // details on what loader is being implemented.
            ifDevClient({
              loaders: ['happypack/loader?id=happypack-devclient-css'],
            }),
            ifProdClient(() => ({
              loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader?sourceMap&importLoaders=2!postcss-loader!sass-loader?outputStyle=expanded&sourceMap&sourceMapContents', // eslint-disable-line
              }),
            })),
            // When targetting the server we use the "/locals" version of the
            // css loader, as we don't need any css files for the server.
            ifNode({
              loaders: ['css-loader/locals', 'postcss-loader', 'sass-loader'],
            }),
          ),
        ),
        ifElse(isClient || isServer)(() => ({
          test: new RegExp(`\\.(${config('bundleAssetTypes').join('|')})$`, 'i'),
          loader: 'file-loader',
          query: {
            publicPath: isDev
              // When running in dev mode the client bundle runs on a
              // seperate port so we need to put an absolute path here.
              ? `http://${config('host')}:${config('clientDevServerPort')}${config('bundles.client.webPath')}`
              // Otherwise we just use the configured web path for the client.
              : config('bundles.client.webPath'),
            emitFile: isClient,
          },
        })),
      ]),
    },
  };

  if (isProd && isClient) {
    webpackConfig = withServiceWorker(webpackConfig, bundleConfig);
  }

  // Apply the configuration middleware.
  return config('plugins.webpackConfig')(webpackConfig, buildOptions);
}
