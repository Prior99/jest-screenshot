import { config } from "../config";
import { writeFileSync, mkdirSync, unlinkSync } from "fs";
import * as rimraf from "rimraf";

describe("config()", () => {
    let oldCwd: () => string;
    const tmpPath = `${process.cwd()}/tmp-test-config`;

    beforeEach(() => {
        mkdirSync(tmpPath);
        process.cwd = () => tmpPath;
    });

    afterEach(() => {
        rimraf.sync(tmpPath);
        process.cwd = oldCwd;
    });

    it("detects the configuration with the package.json containing a config", () => {
        const someConfig = {
            snapshotsDir: "__image_snapshots__",
            pixelThresholdAbsolute: 90,
        };
        writeFileSync(`${tmpPath}/package.json`, JSON.stringify({
            jestScreenshot: someConfig,
        }));

        expect(config()).toEqual(someConfig);
    });

    it("detects the configuration with a config file", () => {
        const someConfig = {
            snapshotsDir: "__screenshot_snapshots__",
            pixelThresholdAbsolute: 1000,
        };
        writeFileSync(`${tmpPath}/jest-screenshot.json`, JSON.stringify(someConfig));

        expect(config()).toEqual(someConfig);
    });

    it("detects the merged configuration with both config file and package.json config present", () => {
        const someConfigPackage = {
            snapshotsDir: "__package_snapshots__",
            pixelThresholdAbsolute: 1000,
            colorThreshold: 0.3,
        };
        const someConfigFile = {
            snapshotsDir: "__config_snapshots__",
            pixelThresholdAbsolute: 100,
            pixelThresholdRelative: 0.5,
        };
        writeFileSync(`${tmpPath}/jest-screenshot.json`, JSON.stringify(someConfigFile));
        writeFileSync(`${tmpPath}/package.json`, JSON.stringify({
            jestScreenshot: someConfigPackage,
        }));

        expect(config()).toEqual({
            snapshotsDir: "__config_snapshots__",
            pixelThresholdAbsolute: 100,
            pixelThresholdRelative: 0.5,
            colorThreshold: 0.3,
        });
    });

    it("detects a sane default configuration without a configuration present", () => {
        expect(config()).toEqual({
            pixelThresholdRelative: 0,
        });
    });

    it("throws an error with a broken package.json", () => {
        writeFileSync(`${tmpPath}/package.json`, "{");
        expect(() => config()).toThrowErrorMatchingSnapshot();
    });

    it("throws an error with a broken config file", () => {
        writeFileSync(`${tmpPath}/jest-screenshot.json`, "{");
        expect(() => config()).toThrowErrorMatchingSnapshot();
    });
});
