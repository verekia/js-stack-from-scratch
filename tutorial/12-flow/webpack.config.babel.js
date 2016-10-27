/* eslint-disable import/no-extraneous-dependencies */

import webpack from 'webpack';

const config = {
  output: {},
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
    })
  );
  config.output.filename = 'client-bundle.min.js';
} else {
  config.devtool = 'source-map';
  config.output.filename = 'client-bundle.js';
}

export default config;
