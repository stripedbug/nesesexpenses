const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
        name: "Neşe's Expenses",
        themeColor: '#ec4899',
        msTileColor: '#ec4899',
        appleMobileWebAppCapable: 'no',
        appleMobileWebAppStatusBarStyle: 'default',
        workboxOptions: {
            exclude: [/_redirects/],
        }
    },
})
