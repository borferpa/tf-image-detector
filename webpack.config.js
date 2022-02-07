const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");


module.exports = {
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "app.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
            chunkFilename: '[name].chunk.[contenthash].css',
        }),
    ],

    devServer: {
        historyApiFallback: true,
        port: 8080,
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
            {
                test: /\.scss$/,
                use: [
                  { loader: MiniCssExtractPlugin.loader },
                  {
                    loader: 'css-loader',
                    options: {
                      modules: {
                        localIdentName: '[hash:base64:5]',
                        exportLocalsConvention: 'dashes'
                      },
                      importLoaders: 1,
                    },
                  },
                  {
                    loader: 'postcss-loader',
                    options: {
                      postcssOptions: {
                        plugins: [['postcss-preset-env', {}]],
                      },
                    },
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      sassOptions: {
                        includePaths: ['node_modules'],
                      },
                    },
                  },
                ],
            },
        ]
    }
}