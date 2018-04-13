const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCSS = new ExtractTextPlugin('[name].css');

module.exports = {
    entry: {
        "report-viewer": path.resolve(__dirname, "src/report-viewer"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                loader: "ts-loader",
                options: {
                    configFile: "tsconfig-webpack.json",
                },
                exclude: [
                    /__tests__/,
                    /dist/,
                ],
            },
            {
                test: /\.(s[ac]ss)$/,
                loader: extractCSS.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]_[local]_[hash:base64:5]',
                                sourceMap: true,
                            }
                        },
                        {
                            loader: "resolve-url-loader",
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                }),
            },
        ],
    },
    plugins: [
        extractCSS,
    ],
    devtool: "source-map",
}
