const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const dev = process.env.NODE_ENV === "dev"

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
        app: ['./src/css/app.scss', './src/js/app.js']
    },
    watch: dev,
    output: {
        path: path.resolve('./public/src'),
        filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
        publicPath: '/src/'
    },
    resolve: {
        alias: {
            '@css': path.resolve('./src/css/'),
            '@': path.resolve('./src/js/')
        }
    },
    devtool: dev ? "cheap-module-eval-source-map" : false,
    devServer: {
        overlay: true,
        contentBase: path.resolve('./public')     
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['eslint-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
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
                      name: '[name].[hash:7].[ext]',
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
            filename: dev ? '[name].css' :'[name].[contenthash:8].css',
            disable: dev
        })
    ]
}

/** PRODUCTION CONFIG  */

if(!dev){
    config.plugins.push(new UglifyJSPlugin({
        sourceMap: true
    }))
    config.plugins.push(new ManifestPlugin()),
    config.plugins.push(new cleanWebpackPlugin(['dist'], {
        root: path.resolve('./'),
        verbose: true,
        dry: false
    })) 
}

module.exports = config