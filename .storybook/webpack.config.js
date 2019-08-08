const path = require('path')
const autoprefixer = require('autoprefixer')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

// References
// https://stackoverflow.com/questions/56241876/storybook-with-vue-in-typescript-how-to-import-from-a-storybook-ts-file-webpac
// https://gist.github.com/aaronfullerton/48a52d99763b68fd6bb5d84a4f4d44b2

// Export a function. Accept the base config as the only param.
module.exports = ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need

  config.resolve.alias = {
    vue$: 'vue/dist/vue.esm.js',
    '@': path.resolve(__dirname, '../src/'),
  }

  config.resolve.extensions.push('.ts', '.scss', '.pug')

  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true, // disable type checker - we will use it in fork plugin
        },
      },
    ],
  })

  config.module.rules.push({
    test: /\.scss$/,
    // loaders: ['style-loader', 'css-loader', 'sass-loader'],
    use: [
      { loader: 'style-loader' },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          // modules: true,
          // localIdentName: '[local]_[hash:base64:5]',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          ident: 'postcss',
          plugins: () => [autoprefixer()],
        },
      },
      {
        loader: 'sass-loader',
        options: { sourceMap: true },
      },
    ],
  })

  config.module.rules.push({
    test: /\.pug$/,
    loaders: ['pug-plain-loader'],
  })

  config.plugins.push(new ForkTsCheckerWebpackPlugin())

  // Return the altered config
  return config
}
