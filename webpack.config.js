const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;
const PATHS = {
    src: path.join(__dirname, 'src/js'),
    dist: path.join(__dirname, 'dist'),
    style: path.join(__dirname, 'src/style/main.scss'),
    fonts: path.join(__dirname, 'src/fonts/roboto')
};

// Common config
const common = {
    entry: {
        src: PATHS.src
    },
    resolve: {
        extensions: ['', '.js', '.scss'],
    },
    output: {
        path: PATHS.dist,
        filename: '[name].[ext]',
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loaders: ['babel'],
                include: PATHS.src,
            },
            {
                test: /\.(jpeg|jpg|png)$/,
                loader: 'url?limit=25000&name=../img/[name].[ext]',
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader',
                include: PATHS.fonts
            }
        ]
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, 'node_modules')]
    },
};

// Development server config
if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            stats: 'errors-only',
            contentBase: './dist/',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:8080',
                'Access-Control-Allow-Credentials': 'true'
            },
			// host and port are from env
            host: process.env.HOST,
            port: process.env.PORT
        },
        output: {
            // cPath: '/assets/',
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass'],
                    include: PATHS.style
                },
                {
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    include: PATHS.style
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

// Build config
if (TARGET === 'build' || TARGET === 'stats') {
    module.exports = merge(common, {
        entry: {
            resume: './app/js/resume.js',
            style: PATHS.style
        },
        output: {
            path: PATHS.dist,
            filename: '[name].js',
			// chunkFilename: '[chunkhash].js'
        },
        module: {
            loaders: [{
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass')
            }]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
            }),
            new ExtractTextPlugin('[name].css')
        ]
    });
}
