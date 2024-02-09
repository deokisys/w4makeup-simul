const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // enntry file
  // - sass가 존재할경우 entry: ['@babel/polyfill', './main.js', './main.scss'],
  entry: ["@babel/polyfill", "./src/main.js", "./src/css/main.scss"],
  // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js",
  },
  //server설정
  devServer: {
    //react-router에서 url에서 바로 접근하는거 가능하도록
    historyApiFallback: true,
    //contentBase에서 변경됨
    static: {
      directory: "dist",
    },
    // hot 프로퍼티를 true로 설정!
    hot: true,
  },
  plugins: [
    // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
    new MiniCssExtractPlugin({ filename: "css/style.css" }),
    new HTMLWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", // translates CSS into CommonJS
          "sass-loader", // compiles Sass to CSS, using Node Sass by default
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        loader: "file-loader",
        options: {
          publicPath: "",
          // name: 'images/[name].[ext]',
          name: "[name].[ext]?[hash]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js"],
    fallback: {
      //https://github.com/justadudewhohacks/face-api.js/issues/154
      fs: false,
    },
  },
  devtool: "source-map",
  // https://webpack.js.org/concepts/mode/#mode-development
};
