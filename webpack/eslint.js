const ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = function(){
    return {
        module: {
            rules: [
                 {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ['eslint-loader']
                }
            ]
        }
    }
}