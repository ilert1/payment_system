import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
    // moduleNameMapping: {
    //     "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    //     "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/src/__mocks__/fileMock.js"
    // },
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: ["<rootDir>/src/**/*.test.(ts|tsx|js)", "<rootDir>/src/**/*.test.(ts|tsx|js)"],
    collectCoverageFrom: ["src/**/*.(ts|tsx)", "!src/**/*.d.ts", "!src/index.tsx", "!src/serviceWorker.ts"]
};

export default config;
