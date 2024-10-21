const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const path = require("path")
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin")

const extract = new ExtractTextPlugin("style.min.css")



module.exports = {
  entry: {
    shouldPC: "./src/external/shouldPC.ts",
    LOADING: "./src/external/loading.ts",
    editor: "./src/app.tsx"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs"],
   // alias: {
   //   ".js": [".ts", ".tsx", ".js", ".jsx"],
   //   ".mjs": [".mts", ".mjs"],
   //   ".cjs": [".cts", ".cjs"],
   // },
  },
  output: {
    filename: "[name].min.js",
    path: path.join(__dirname, "build"),
    library: "[name]",
    libraryTarget: "global",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ["ts-loader"]
      },

      //{
      // test: /\.mjs$/,
      //  //include: path.resolve(__dirname, 'src'),
      //  //exclude: /(node_modules|bower_components|build)/,
      //  use: ['babel-loader']
      //},
      {
        test: /\.(?:js|mjs|cjs)$/,
        include: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            targets: "defaults",
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react'],
              ['@babel/preset-typescript'],  
            ],
            configFile: './.babelrc',
          }
        }
      },
      {
        test: /\.js$/,
        include: /node_modules\/prettier/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(css|less)$/,
        use: extract.extract({
          use: [
            {
              loader: "css-loader"
            }
          ],
          fallback: "style-loader"
        })
      },
      {
        test: /\.(woff|svg|eot|ttf)$/,
        use: ["url-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: 
      "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">" + `<meta name="viewport" content="maximum-scale=1.0, user-scalable=0">` + "<title>" + "Editor" + "</title></head><body>" + `<div id="root"></div>` + "</body></html>"

    }),
    new ScriptExtHtmlWebpackPlugin({
      async: ["shouldPC"]
    }),
    extract,
    new MonacoWebpackPlugin()
  ],
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules|lib/
  },
  watch: true,
}
