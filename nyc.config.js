module.exports = {
  "check-coverage": false,
  "per-file": true,
  all: true,
  include: ["src/**/*.{vue,js}"],
  exclude: ["src/main.js", "src/cardUtils.js"],
  reporter: ["lcov", "text", "text-summary", "html"],
  extension: [".js", ".vue"]
};
