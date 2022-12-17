module.exports = {
  presets: [
    "@babel/preset-typescript",
    ["@babel/preset-env", { targets: { node: "current" }, loose: false }],
  ],
  plugins: [
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: false }],
    [
      "module-resolver", { alias: { 
        "@routes": "./src/routes",
        "@middlewares": "./src/middlewares",
        "@infra": "./src/infra",
        "@handlers": "./src/handlers",
        "@config": "./src/config",
        "@helpers": "./src/helpers",
        "@models": "./src/models",
        "@common": "./src/common",
      }}
    ],
  ],
  ignore: ["**/*.spec.ts"],
};