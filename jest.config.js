module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "routes/**/*.js",
    "models/**/*.js",
    "validations/**/*.js",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 30000,
};
