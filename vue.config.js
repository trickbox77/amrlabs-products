
//  configureWebpack: {
//   optimization: {
//     splitChunks: {
//       chunks: 'all'
//     }
//   }
// },
//splitChunks: false
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  publicPath:  '/' ,
  productionSourceMap: false,
  transpileDependencies: ['dom7', 'swiper', 'ssr-window'],
  configureWebpack: {
    // plugins : [new BundleAnalyzerPlugin()],
  },
  chainWebpack: config => {
    config.module.rules.delete('eslint');
    config.plugins.delete('prefetch');
    config.optimization.delete('splitChunks')
    config.optimization.splitChunks(false)
    config.performance
      .maxEntrypointSize(512000)
      .maxAssetSize(512000);
  },
  pwa: {
    name: "RMS",
    themeColor: "#353535",
    msTileColor: "#353535",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    workboxOptions: {
      skipWaiting: true
    }
  },
  devServer: { https: false, historyApiFallback: true }
  // devServer: {
  //   overlay: {
  //     warnings: true,
  //     errors: true
  //   }
  // }
}
