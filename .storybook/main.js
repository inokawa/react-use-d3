module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.(tsv)$/,
      use: ["raw-loader"],
    });
    return config;
  },
};
