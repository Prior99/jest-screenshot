const path = require("path");
const MiniCSSPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
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
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: "tsconfig-webpack.json",
                },
                exclude: [
                    /__tests__/,
                    /dist/,
                ],
            },
            {
                test: /\.(s[ac]ss)$/,
                use: [
                    {
                        loader: MiniCSSPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
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
            },
        ],
    },
    plugins: [
        new MiniCSSPlugin({ filename: "[name].css" }),
    ],
    devtool: "source-map",
}
