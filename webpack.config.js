var path = require('path')

module.exports = {
  entry: {
    lib: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: './[name]-bundle.js',
    libraryTarget: 'umd',
    library: 'transisAware',
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    transis: 'transis'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-2']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { modules: true }
          }
        ]
      },
    ]
  }

}