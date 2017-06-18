module.exports = {
  entry: './src/index.js',
  output: {
    filename: './dist/bundle.js',
    // path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }
      },
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader',
          options: { modules: true }
        }
      },
    ]
  }

}