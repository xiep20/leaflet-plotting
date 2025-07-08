const autoprefixer = require('autoprefixer');
const px2rem = require('postcss-px2rem')
// 配置基本大小
const postcss = px2rem({
  // 基准大小 baseSize，需要和rem.js中相同
  remUnit: 37.5
})

module.exports = {
  // outputDir: "docs",
  // publicPath: process.env.NODE_ENV === "production" ? "/vant-demo/" : "/",
  lintOnSave: false,
  publicPath: './',
  chainWebpack: config => {
    // const svgRule = config.module.rule('svg')
    // svgRule.uses.clear()
    // svgRule
    //   .test(/\.svg$/)
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
  },
  productionSourceMap: false,
  devServer: {
    open: true,
    port: 8088,
    overlay: {
      errors: true,
      warnings: true
    },
    proxy: {
      '/static': {
        // ws: false, // proxy websockets
        target: 'http://123.249.117.7:8021',
        changeOrigin: true,
        pathRewrite: {
          '^/static': '/static'
        }
      },
      '/multipleuavpatrol': {
        // ws: false, // proxy websockets
        // target: 'http://123.249.101.36:8021',
        target: 'http://123.249.101.36:8021',
        changeOrigin: true,
        pathRewrite: {
          '^/multipleuavpatrol': '/multipleuavpatrol'
        }
      },
      '/hydrotechn': {
        // ws: false, // proxy websockets
        target: 'http://123.249.3.227:8021',
        changeOrigin: true,
        pathRewrite: {
          '^/hydrotechn': '/hydrotechn'
        }
      },
      
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          postcss
        ],
      },
    },
  },
  configureWebpack: (config) => {
    return {
      devtool: 'source-map'
    }
  }
}
