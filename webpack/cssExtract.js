const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = function(dev){

    let cssLoaders = [
        { 
            loader: 'css-loader', 
            options: { 
                importLoaders: 1,
                minimize: !dev
            } 
        }
    ]
    if(!dev) {
        cssLoaders.push({
            loader: 'postcss-loader',
                options: {
                    plugins: (loader) => [                           
                        require('autoprefixer')({
                            browsers: ['last 2 versions', 'ie > 8']
                            }),                            
                        ]
                }
        })
    }
    
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: cssLoaders
                    })
                },
                {
                    test: /\.(sass|scss)$/,
                    use:  ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [...cssLoaders, 'sass-loader']
                    })
                }
            ]
        }
    }
}