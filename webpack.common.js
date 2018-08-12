var path = require("path");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = {
  entry: {
    background: path.join(__dirname, "src", "js", "background.ts"),
    content: path.join(__dirname, "src", "js", "content.ts"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
        exclude: /node_modules|typings/,
      },
      {
        test: /\.(png)$/,
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(["build"]),
    new CopyWebpackPlugin([
      {
        from: "src/manifest.json",
        transform: function(content, path) {
          // generates the manifest file using the package.json informations
          return Buffer.from(
            JSON.stringify({
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            }),
          );
        },
      },
      "src/icons",
    ]),
    new WriteFilePlugin(),
  ],
};
