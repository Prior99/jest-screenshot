import { setupJestScreenshot } from "..";
import { toMatchImageSnapshot } from "../to-match-image-snapshot";
import { SnapshotState, JestTestConfiguration } from "../jest";
import { readdirSync, readFileSync, unlinkSync, existsSync, writeFileSync } from "fs";
import * as rimraf from "rimraf";

function getJestTestConfiguration(): JestTestConfiguration {
    let testConfiguration: JestTestConfiguration;
    expect.extend({
        storeSnapshotState() {
            testConfiguration = this as any;
            return {
                pass: true,
                message() { return ""; },
            };
        },
    });
    (expect as any)().storeSnapshotState();
    return testConfiguration;
}

describe("toMatchImageSnapshot", () => {
    let testConfig: JestTestConfiguration;
    let originalUpdateSnapshot: "new" | "all" | "none";

    beforeEach(() => {
        setupJestScreenshot();
    });

    beforeEach(() => {
        testConfig = getJestTestConfiguration();
        originalUpdateSnapshot = testConfig.snapshotState._updateSnapshot;
        try {
            unlinkSync(`${process.cwd()}/jest-screenshot.json`);
        } catch (err) {
            return;
        }
    });

    afterEach(() => {
        testConfig.snapshotState._updateSnapshot = originalUpdateSnapshot;
    });

    describe("with no threshold provided", () => {
        it("detects a matching snapshot as matching", () => {
            expect(() => {
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-gradient.png`)).toMatchImageSnapshot();
            }).not.toThrowError();
        });

        [
            { colorThreshold: 0.0 },
            { colorThreshold: 0.1 },
            { colorThreshold: 0.5 },
            { colorThreshold: 0.6 },
        ].forEach(({ colorThreshold }) => {
            it(`with a color threshold of ${colorThreshold} detects the snapshot as not matching`, () => {
                writeFileSync(`${process.cwd()}/jest-screenshot.json`, JSON.stringify({ colorThreshold }));
                setupJestScreenshot();
                expect(() => {
                    expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
                }).toThrowErrorMatchingSnapshot();
            });
        });

        [
            { colorThreshold: 0.7 },
            { colorThreshold: 1.0 },
        ].forEach(({ colorThreshold }) => {
            it(`with a color threshold of ${colorThreshold} detects the snapshot as matching`, () => {
                writeFileSync(`${process.cwd()}/jest-screenshot.json`, JSON.stringify({ colorThreshold }));
                setupJestScreenshot();
                expect(() => {
                    expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
                }).not.toThrowError();
            });
        });
    });

    describe("with an absolute threshold provided", () => {
        const colorThreshold = 0.6;

        it("fails with an absolute threshold of 204", () => {
            const pixelThresholdAbsolute = 204;
            writeFileSync(`${process.cwd()}/jest-screenshot.json`, JSON.stringify({
                colorThreshold,
                pixelThresholdAbsolute,
            }));
            setupJestScreenshot();
            expect(() => {
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
            }).toThrowErrorMatchingSnapshot();
        });

        it("passes with an absolute threshold of 205", () => {
            const pixelThresholdAbsolute = 205;
            writeFileSync(`${process.cwd()}/jest-screenshot.json`, JSON.stringify({
                colorThreshold,
                pixelThresholdAbsolute,
            }));
            setupJestScreenshot();
            expect(() => {
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
            }).not.toThrowError();
        });
    });

    describe("with `.not` specified", () => {
        it("fails always", () => {
            expect(() => {
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).not.toMatchImageSnapshot();
            }).toThrowErrorMatchingSnapshot();
        });
    });

    describe("when called outside of a jest unit test context", () => {
        it("fails", () => {
            expect(function() {
                toMatchImageSnapshot(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`), {});
            }.bind({})).toThrowErrorMatchingSnapshot();
        });
    });

    describe("with the snapshot not matching", () => {
        const snapshotToUpdatePath = `${__dirname}/__snapshots__/test-to-match-image-snapshot-ts-to-match-image-snapshot-with-the-snapshot-not-matching-updates-the-snapshot-when-updating-is-enabled-1-d8503.snap.png`; // tslint:disable-line
        const originalContent = readFileSync(snapshotToUpdatePath);

        afterEach(() => {
            try {
                writeFileSync(snapshotToUpdatePath, originalContent);
            } catch (err) {
                return;
            }
        });

        it("updates the snapshot when updating is enabled", () => {
            const expectedContent = readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`);
            expect(() => {
                testConfig.snapshotState._updateSnapshot = "all";
                expect(expectedContent).toMatchImageSnapshot();
            }).not.toThrowError();
            expect(readFileSync(snapshotToUpdatePath)).toEqual(expectedContent);
        });

        it("fails when updating is disabled", () => {
            expect(() => {
                testConfig.snapshotState._updateSnapshot = "none";
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
            }).toThrowErrorMatchingSnapshot();
            expect(readFileSync(snapshotToUpdatePath)).toEqual(originalContent);
        });
    });

    describe("with the snapshot not existing", () => {
        const snapshotToCreatePath = `${__dirname}/__snapshots__/test-to-match-image-snapshot-ts-to-match-image-snapshot-with-the-snapshot-not-existing-creates-the-snapshot-when-updating-is-enabled-1-14292.snap.png`; // tslint:disable-line

        afterEach(() => {
            try {
                unlinkSync(snapshotToCreatePath);
            } catch (err) {
                return;
            }
        });

        it("fails when updating is disabled", () => {
            expect(() => {
                testConfig.snapshotState._updateSnapshot = "none";
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
            }).toThrowErrorMatchingSnapshot();
        });

        it("creates the snapshot when updating is enabled", () => {
            expect(existsSync(snapshotToCreatePath)).toBe(false);
            expect(() => {
                testConfig.snapshotState._updateSnapshot = "all";
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
            }).not.toThrowError();
            expect(existsSync(snapshotToCreatePath)).toBe(true);
        });
    });

    it("after a failing snapshot test creates the necessary reports", () => {
        rimraf.sync(`${process.cwd()}/jest-screenshot-report`);

        setupJestScreenshot();
        expect(() => {
            expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
        }).toThrowError();

        const snapshotFilename = "test-to-match-image-snapshot-ts-to-match-image-snapshot-after-a-failing-snapshot-test-creates-the-necessary-reports-1-86dd5.snap.png"; // tslint:disable-line
        const contents = readdirSync(`${process.cwd()}/jest-screenshot-report/reports`);
        expect(contents).toContain(snapshotFilename);
        const snapshotContents = readdirSync(`${process.cwd()}/jest-screenshot-report/reports/${snapshotFilename}`);
        expect(snapshotContents).toEqual([
            "diff.png",
            "info.json",
            "received.png",
            "snapshot.png",
        ]);
        const infoFileContents =
            readFileSync(`${process.cwd()}/jest-screenshot-report/reports/${snapshotFilename}/info.json`, "utf8");
        expect(JSON.parse(infoFileContents)).toMatchSnapshot();
    });

    it("doesn't create a report with `noReport` set to `true`", () => {
        rimraf.sync(`${process.cwd()}/jest-screenshot-report`);

        writeFileSync(`${process.cwd()}/jest-screenshot.json`, JSON.stringify({ noReport: true }));
        setupJestScreenshot();
        expect(() => {
            expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
        }).toThrowError();

        expect(existsSync(`${process.cwd()}/jest-screenshot-report`)).toBe(false);
        unlinkSync(`${process.cwd()}/jest-screenshot.json`);
    });
});
