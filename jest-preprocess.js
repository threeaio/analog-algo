const babelJest = require("babel-jest")

const babelOptions = {
    presets: ["babel-preset-gatsby", "@babel/preset-typescript"],
  }

module.exports = babelJest.createTransformer(babelOptions)