// see this issue: https://github.com/vuejs/vue-cli/issues/1363
// and this workaround: https://gist.github.com/lsapan/3bfd0ffc0fb3d4a036fce84f6eea142e

// const { execSync } = require("child_process");

module.exports = {
  chainWebpack: config => {
    // Only add this to the webpack chain when running code coverage
    if (process.env.NODE_ENV === "test") {
      // addresses a problem where istanbul duplicates the file path for .vue files (e.g. src/components/src/components/Card.vue)
      //   execSync(
      //     "sed -i 's/source: pathutils.relativeTo(start.source, origFile),/source: origFile,/' node_modules/istanbul-lib-source-maps/lib/get-mapping.js"
      //   );

      // fixes an issue where coverage line references are incorrect
      config.devtool("cheap-module-eval-source-map");

      // add a code coverage instrumenter to run AFTER cache-loader and babel-loader run
      //   config.module
      //     .rule("js")
      //     .test(/\.js$/)
      //     .use("istanbul-instrumenter-loader")
      //     .loader("istanbul-instrumenter-loader")
      //     .after("babel-loader")
      //     .options({
      //       esModules: true
      //     });
    }
  }
};
