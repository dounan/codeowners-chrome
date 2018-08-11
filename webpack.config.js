var webpack = require("webpack");
var path = require("path");
var env = require("./utils/env");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var WriteFilePlugin = require("write-file-webpack-plugin");

var options = {
  entry: {
    background: path.join(__dirname, "src", "js", "background.js"),
    content: path.join(__dirname, "src", "js", "content.js"),
    popup: path.join(__dirname, "src", "js", "popup.js"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(png)$/,
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(["build"]),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
    }),
    new CopyWebpackPlugin([
      {
        from: "src/manifest.json",
        transform: function (content, path) {
          // generates the manifest file using the package.json informations
          return Buffer.from(JSON.stringify({
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,
            ...JSON.parse(content.toString())
          }))
        }
      },
      "src/icons",
    ]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new WriteFilePlugin()
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-source-map";
}

module.exports = options;
