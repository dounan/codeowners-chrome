var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require("../webpack.dev");
var path = require("path");

var options = config.chromeExtensionBoilerplate || {};
var excludeEntriesToHotReload = options.notHotReload || [];
var port = process.env.PORT || 3000;

for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      "webpack-dev-server/client?http://localhost:" + port,
      "webpack/hot/dev-server",
    ].concat(config.entry[entryName]);
  }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || [],
);

delete config.chromeExtensionBoilerplate;

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: path.join(__dirname, "../build"),
  headers: {"Access-Control-Allow-Origin": "*"},
});

server.listen(port);
