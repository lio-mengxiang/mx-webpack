const path = require('path');
const entryOptionPlugin = require('./plugins/entry-option-plugin')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].bundle.js'
  },
  // resolveLoaders: {
  //   modules: './loaders'
  // },
  // module: {
  //   rules: [
  //     {
  //       test: /\.less$/,
  //       loader: ['style-loader', 'less-loader']
  //     }
  //   ]
  // },
  optimization: {
    runtimeChunk: true,
  },
  plugins: [
    new entryOptionPlugin()
  ]
}
