const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 8081,
    historyApiFallback: {
      index: 'index.html',
    },
  },
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: 'http://localhost:8081',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.ttf$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              publicPath: '../',
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(jpg|jpeg|png|gif|mp3|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '../dist/fonts/[name].[ext]',
              publicPath: './fonts',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__dirname, '../tsconfig.json'),
      }),
    ],
    modules: [path.join(__dirname, '../node_modules')],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve('dist')],
    }),

    new HtmlWebpackPlugin({
      hash: false,
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
};
