var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var HtmlWebpackConfig = {
    title: 'seesee',
    filename: 'index.html',
    template: "./src/example.html",
    hash: true,
    showErrors: true,
    inject: 'body'
};


module.exports = {
    mode: "development",
    entry: "./src/example.tsx",
    output: {
        filename: "seesee.js",
        path: __dirname + "/example",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    plugins: [
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
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                "declaration": false
                            }
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        port: process.env.PORT || 8888,
        host: '127.0.0.1',
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