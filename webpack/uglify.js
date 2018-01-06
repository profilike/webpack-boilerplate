const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function(){
    return {
        plugins: [
            new UglifyJsPlugin({
                sourceMap: true
            })
        ]
    }
}