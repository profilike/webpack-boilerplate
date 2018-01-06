module.exports = function(dev){
    return {
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    use: [
                      {
                        loader: 'url-loader',                
                        options: {
                          limit: 8192,
                          name: '[name].[ext]',
                          outputPath: 'images/'
                        }
                      },
                      {
                        loader: 'img-loader',
                        options: {
                            enabled: !dev
                        }
                    }
                    ]
                }
            ]
        }
    }
}