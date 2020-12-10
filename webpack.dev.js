var path = require('path'),
    CopyPlugin = require('copy-webpack-plugin'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin');

var cfg = {
    srcPath: path.resolve('./src'),
    distPath: path.resolve('./dist')
}

module.exports = {
	entry: path.join(cfg.srcPath, 'js/main.js'),
	output: {
		path: cfg.distPath + '/js',
	},

	devServer: {
		open: false,
		contentBase: [
			cfg.srcPath,
		],
		port: 8000,
	},

	plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
              { from: path.join(cfg.srcPath, 'index.html'), to: cfg.distPath },
              { from: path.join(cfg.srcPath, 'assets'), to: path.join(cfg.distPath, 'assets') },
            ],
          }),
      ]
};