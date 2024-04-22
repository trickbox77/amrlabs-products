const PLUGINLIST = [
  [
    '@babel/plugin-proposal-decorators',
    {
      legacy: true
    }
  ],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-transform-runtime',
  '@babel/plugin-transform-classes',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-json-strings',
  '@babel/plugin-proposal-function-sent',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-proposal-throw-expressions',
  '@babel/plugin-proposal-export-default-from'
]

if (process.env.NODE_ENV === 'production') {
  PLUGINLIST.push("transform-remove-console")
}


module.exports = {
  presets: [
    [
      '@vue/app',
      {
        modules: false,
        useBuiltIns: 'entry'
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-classes',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-json-strings',
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-default-from'

  ],
  env: {
    test: {
      presets: ['@babel/preset-env'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        'transform-es2015-modules-commonjs',
        'babel-plugin-dynamic-import-node'
      ]
    }
  }
};