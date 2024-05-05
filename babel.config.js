module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
// "transform-remove-console"
//"icon": "./assets/icon.jpg",
// "adaptiveIcon": {
//   "foregroundImage": "./assets/adaptive-icon.png",
//   "backgroundColor": "#FEFFEF"
// },
