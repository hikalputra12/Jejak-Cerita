// webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      // Tambahkan aturan ini untuk menangani gambar dari leaflet
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Menangkap file gambar juga
        include: /node_modules[\\/]leaflet/, // Hanya dari folder leaflet
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]', // Menyimpan di dist/images
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
        // Tambahkan pola ini untuk menyalin gambar marker Leaflet
        {
          from: path.resolve(__dirname, 'node_modules/leaflet/dist/images/'),
          to: path.resolve(__dirname, 'dist/images/'),
        },
      ],
    }),
  ],
};