import { decode, readPngFileSync, writePngFileSync, PngImage } from "node-libpng";
import { diffImages } from "native-image-diff";
import chalk from "chalk";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { getSnapshotPath, getReportPath } from "./filenames";
import { SnapshotState, isJestTestConfiguration, MatcherResult } from "./jest";
import { sync as mkdirp } from "mkdirp";
import { dirname, join } from "path";

/**
 * Used as configuration for `toMatchImageSnapshot`.
 */
export interface ToMatchImageSnapshotConfiguration {
    /**
     * Passed to **native-image-diff**. Will disable or enable antialiasing detection.
     * Defaults to `true`.
     */
    detectAntialiasing?: boolean;
    /**
     * Passed to **native-image-diff**. Specifies the threshold on a scale from `0` to `1`
     * for when a pixel counts as changed. `0` allows no difference between two pixels and
     * `1` detects no difference between a white and a black pixel.
     */
    colorThreshold?: number;
    /**
     * If specified, makes the test check for the absolute number of pixels changed. When for example
     * set to `100`, An image which differs from it's snapshot by `101` pixels would fail.
     *
     * Is set to `undefined` by default and hence the check is disabled.
     */
    pixelThresholdAbsolute?: number;
    /**
     * If specified, makes the test check for the relative number of pixels changed. When for example
     * set to `0.5`, An image which differs from it's snapshot by 50.0001% of the pixels would fail.
     *
     * Is set to `0` if neither `pixelThresholdAbsolute` nor `pixelThresholdRelative` are confiured.
     */
    pixelThresholdRelative?: number;
    /**
     * An optional generator function for generating the names for the image snapshot files.
     */
    identifier?: (testPath: string, currentTestName: string, counter: number) => string;
    /**
     * An optional directory name to store the snapshots in. Defaults to `__snapshots__`.
     */
    snapshotsDir?: string;
    /**
     * The directory to write the report to. Defaults to a directory `jest-screenshot-reports` in
     * the projects root directory. Can be set to `null` to explicitly disable generating reports.
     */
    reportPath?: (testPath: string, currentTestName: string, counter: number) => string;
}

/**
 * Performs the actual check for equality of two images.
 *
 * @param snapshotImage The image from the snapshot.
 * @param receivedImage The image received from the `expect(...)` call.
 * @param snapshotNumber The number of the snapshot in this test.
 * @param configuration The configuration of the call to `toMatchImageSnapshot`.
 *
 * @return A `MatcherResult` with `pass` and a message which can be handed to jest.
 */
function checkImages(
    snapshotImage: PngImage,
    receivedImage: PngImage,
    snapshotNumber: number,
    configuration: ToMatchImageSnapshotConfiguration,
): MatcherResult & { diffImage?: { data: Buffer, width: number, height: number } } {
    const {
        colorThreshold,
        detectAntialiasing,
        pixelThresholdAbsolute,
        pixelThresholdRelative,
    } = configuration;
    // Perform the actual image diff.
    const { pixels: changedPixels, image: diffImage } = diffImages({
        image1: receivedImage,
        image2: snapshotImage,
        colorThreshold,
        detectAntialiasing,
    });
    const expected = `stored snapshot ${snapshotNumber}`;
    const preamble = `${chalk.red("Received value")} does not match ${chalk.green(expected)}.`;
    if (typeof pixelThresholdAbsolute === "number" && changedPixels > pixelThresholdAbsolute) {
        return {
            pass: false,
            message: () =>
                `${preamble}\n\n` +
                `Expected less than ${chalk.green(`${pixelThresholdAbsolute} pixels`)} to have changed, ` +
                `but ${chalk.red(`${changedPixels} pixels`)} changed.`,
            diffImage,
        };
    }
    const snapshotImagePixels = snapshotImage.width * snapshotImage.height;
    const receivedImagePixels = receivedImage.width * receivedImage.height;
    const totalPixels = Math.max(snapshotImagePixels, receivedImagePixels);
    const changedRelative = changedPixels / totalPixels;
    if (typeof pixelThresholdRelative === "number" && changedRelative > pixelThresholdRelative) {
        const percentThreshold = (pixelThresholdRelative * 100).toFixed(2);
        const percentChanged = (changedRelative * 100).toFixed(2);
        return {
            pass: false,
            message: () =>
                `${preamble}\n\n` +
                `Expected less than ${chalk.green(`${percentThreshold}%`)} of the pixels to have changed, ` +
                `but ${chalk.red(`${percentChanged}%`)} of the pixels changed.`,
            diffImage,
        };
    }
    return { pass: true };
}

/**
 * A matcher for jest with compares a PNG image to a stored snapshot. Behaves similar to `.toMatchSnapshot()`.
 *
 * @param received The buffer from the call to `expect(...)`.
 * @param configuration The configuration object provided when initializing this library
 *     with a call to `jestScreenshot`.
 *
 * @return A `MatcherResult` usable by jest.
 */
export function toMatchImageSnapshot(
    received: Buffer,
    configuration: ToMatchImageSnapshotConfiguration,
): MatcherResult {
    // Check whether `this` is really the expected Jest configuration.
    if (!isJestTestConfiguration(this)) {
        throw new Error("Jest: Attempted to call `.toMatchImageSnapshot()` outside of Jest context.");
    }
    const { testPath, currentTestName, isNot } = this;
    if (isNot) {
        throw new Error("Jest: `.not` cannot be used with `.toMatchImageSnapshot()`.");
    }
    let { snapshotState } = this;
    const { _updateSnapshot } = snapshotState;
    const snapshotPath = getSnapshotPath(testPath, currentTestName, snapshotState, configuration);
    const reportPath = getReportPath(testPath, currentTestName, snapshotState, configuration);
    // Create the path to store the snapshots in.
    mkdirp(dirname(snapshotPath));
    // The image did not yet exist.
    if (!existsSync(snapshotPath)) {
        // If the user specified `-u`, or was running in interactive mode, write the new
        // snapshot to disk and let the test pass.
        if (_updateSnapshot === "new" || _updateSnapshot === "all") {
            snapshotState.added++;
            writeFileSync(snapshotPath, received);
            return { pass: true };
        }
        // Otherwise fail due to missing snapshot.
        return {
            pass: false,
            message: () => `New snapshot was ${chalk.red("not written")}. ` +
                `The update flag must be explicitly passed to write a new snapshot.\n\n` +
                `This is likely because this test is run in a continuous integration (CI) environment ` +
                `in which snapshots are not written by default.`,
        };
    }
    // Decode the new image and read the snapshot.
    const snapshotImage = readPngFileSync(snapshotPath);
    const receivedImage = decode(received);
    // Perform the actual diff of the images.
    const snapshotNumber = snapshotState._counters.get(currentTestName) || 1;
    const { pass, message, diffImage } = checkImages(snapshotImage, receivedImage, snapshotNumber, configuration);
    // If the user specified `-u` and the snapshot changed, update the stored snapshot.
    if (!pass) {
        if (_updateSnapshot === "all") {
            snapshotState.updated++;
            writeFileSync(snapshotPath, received);
            return { pass: true };
        }
        if (reportPath) {
            mkdirp(reportPath);
            writeFileSync(join(reportPath, "received.png"), received);
            writeFileSync(join(reportPath, "snapshot.png"), readFileSync(snapshotPath));
            writePngFileSync(join(reportPath, "diff.png"), diffImage.data, diffImage);
        }
    }
    return { pass, message };
}
