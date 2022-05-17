module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    ['@babel/preset-typescript'],
  ],
  plugins: [
    'babel-plugin-transform-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
    '@babel/plugin-transform-react-jsx',
    [
      'module-resolver',
      {
        extensions: ['.js', '.jsx'],
        root: ['./src/js'],
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ],
};
