module.exports = {
  hooks: {
    config: function (config) {
      config.styles =
        config.styles || config.pluginsConfig["theme-unblocked"].styles;

      return config;
    },
  },
};
