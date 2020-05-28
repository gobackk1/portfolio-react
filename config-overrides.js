const path = require('path')
module.exports = (config, env) => {
  // ランタイムではconsole.logを落とす
  const index = config.optimization.minimizer.findIndex(m =>
    m.options.hasOwnProperty('terserOptions')
  )
  config.optimization.minimizer[
    index
  ].options.terserOptions.compress.drop_console = true
  // import で @エイリアスが使えるようにする
  config.resolve.alias['@'] = path.resolve(__dirname, './src')
  return config
}
