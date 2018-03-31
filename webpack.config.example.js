var webpack = require('webpack');
var path = require('path');


var HtmlWebpackPlugin = require('html-webpack-plugin');

var HtmlWebpackConfig = {
    title: 'seesee',
    filename: 'index.html',
    template: "./src/example.html",
    hash: true,
    showErrors: true,
    inject: 'body',
    minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
    }
};


module.exports = {
    mode: "production",
    entry: [
        "./src/example.tsx"
    ],
    output: {
        filename: "seesee.js",
        path: __dirname + "/example"
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
    }
}