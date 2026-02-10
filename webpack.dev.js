var path = require('path'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

var cfg = {
    srcPath: path.resolve('./src'),
    distPath: path.resolve('./dist')
}

module.exports = {
    entry: path.join(cfg.srcPath, 'ts/main.ts'),
    devtool: 'inline-source-map',
    output: {
        path: cfg.distPath,
        filename: '[name].[contenthash].js'
    },

    devServer: {
        open: false,
        port: 9001,
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            meta: 'name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0"',
            title: 'exploding chicken'
        })
    ]
};