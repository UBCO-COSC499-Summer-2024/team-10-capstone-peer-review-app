module.exports = {
	testEnvironment: "node",
	moduleFileExtensions: ["js", "mjs", "cjs", "json"],
	globals: {
		NODE_ENV: "test"
	},
	testMatch: ["**/tests/**/*.test.js"],
	setupFiles: ["./jest.setup.cjs"],
	transform: {
		"^.+\\.js$": "babel-jest"
	},
	collectCoverage: true,
	coverageReporters: ["text"],
	verbose: true,
	forceExit: true,
	clearMocks: true,
	restoreMocks: true,
	detectOpenHandles: true
};
