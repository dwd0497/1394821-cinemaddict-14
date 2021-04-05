const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    devtool: 'source-maps',
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        watchContentBase: true,
    }
}
