const path = require('path')
const webpack = require('webpack')

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const merge = require('webpack-merge')
const pug = require('./webpack/pug')

const cssLoaders = require('./webpack/cssExtract')
const imageLoaders = require('./webpack/image')
const uglifyJs = require('./webpack/uglify')

const NODE_ENV = process.env.NODE_ENV || 'dev'; // or prod
const dev = (NODE_ENV === 'dev');

const PATH = {
    source: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'dist'),
}

const common = merge([
    {
    entry: {
        app: [PATH.source + '/app.scss', PATH.source + '/app.js']
    },
    watch: dev,
    output: {
        path: PATH.build,
        filename: 'js/[name].js'
    },
    devServer: {
        stats: 'errors-only',
        port: 9000
    },
    devtool: dev ? "cheap-module-eval-source-map" : false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader'
            }        
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: './css/[name].css',
            disable: dev
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: PATH.source + '/index.pug'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        })
        
    ]
    },
    cssLoaders(dev), // false for production
    imageLoaders(dev), // false for production
    pug()

])

module.exports = function(){
    if(NODE_ENV === 'dev'){
        return common;
    }
    if(NODE_ENV === 'prod'){
        return merge([
            common,
            uglifyJs()
        ])
    }
}
