const _ = require("lodash");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const sharedConfigs = {
  context: __dirname,
  entry: {
    app: "./src/index.js",
  },
  plugins: [new MonacoWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-react",
              [
                "@babel/preset-env",
                {
                  targets: {
                    esmodules: true,
                  },
                },
              ],
            ],
          },
        },
      },
      {
        test: require.resolve("webrtc-adapter"),
        use: "expose-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

const mergeResolver = (objValue, srcValue) =>
  _.isArray(objValue) ? objValue.concat(srcValue) : undefined;

module.exports = (configs) =>
  _.mergeWith(sharedConfigs, configs, mergeResolver);
