const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function(){
    return {
        plugins: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    warnings: false,
                    compress: {
                        drop_console: true
                    }
                }
            })
        ]
    }
}