module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/': {
        target: 'http://localhost:8443/personmis',
        changeOrigin: true,
        ws: false
      }
    }
  }
}
