var webpack = require('webpack');
var path = require('path');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var HtmlWebpackPlugin = require('html-webpack-plugin');

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('development'),
    __DEV__: true
};

var HtmlWebpackConfig = {
    title: 'seesee',
    filename: 'index.html',
    template: "./src/example.html",
    hash: true,
    showErrors: true,
    inject: 'body'
};


module.exports = {
    entry: [
        "./src/example.tsx"
    ],
    output: {
        filename: "cplayerexample.js",
        path: __dirname + "/example",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    plugins: [
        new webpack.DefinePlugin(GLOBALS),
        new HtmlWebpackPlugin(HtmlWebpackConfig)
    ],

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                use: [
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            useBabel: true
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        port: process.env.PORT || 8888,
        host: '0.0.0.0',
        publicPath: '/',
        contentBase: './src',
        historyApiFallback: true,
        open: true,
        disableHostCheck: true,
        watchContentBase: true,
        compress: true,
        headers: {
            "access-control-allow-origin":"*"
        },
        proxy: {
            // OPTIONAL: proxy configuration:
            // '/optional-prefix/**': { // path pattern to rewrite
            //   target: 'http://target-host.com',
            //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
            // }
        }
    }
}