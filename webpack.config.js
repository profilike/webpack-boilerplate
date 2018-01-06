const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const dev = process.env.NODE_ENV === "dev"

const PATH = {
    source: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'dist'),
}

/** CSS CONFIG  */

let cssLoaders = [
    { 
        loader: 'css-loader', 
        options: { 
            importLoaders: 1,
            minimize: !dev 
        } 
    },
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

/** MAIN CONFIG  */

let config = {
    entry: {
        app: [PATH.source + '/app.scss', PATH.source + '/app.js']
    },
    watch: dev,
    output: {
        path: PATH.build,
        filename: '[name].js'
    },
    devtool: dev ? "cheap-module-eval-source-map" : false,
    devServer: {
        stats: 'errors-only',
        contentBase: PATH.build 
    },
    module: {
        rules: [
            // {
            //     enforce: 'pre',
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: ['eslint-loader']
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: cssLoaders
                })
            },
            {
                test: /\.scss$/,
                use:  ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [...cssLoaders, 'sass-loader']
                })
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader'
            },
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
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            disable: dev
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: PATH.source + '/index.pug'
        })
    ]
}

/** PRODUCTION CONFIG  */

if(!dev){
    config.plugins.push(new UglifyJSPlugin({
        sourceMap: true
    }))
    // config.plugins.push(new cleanWebpackPlugin(['dist'], {
    //     root: path.resolve('./'),
    //     verbose: true,
    //     dry: false
    // })) 
}

module.exports = config