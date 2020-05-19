import { decode, readPngFileSync, writePngFileSync, PngImage } from "node-libpng";
import { diffImages, DiffImage } from "native-image-diff";
import chalk from "chalk";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { getSnapshotPath, getReportPath, getReportDir } from "./filenames";
import { isJestTestConfiguration, MatcherResult } from "./jest";
import { sync as mkdirp } from "mkdirp";
import * as path from "path";
import { JestScreenshotConfiguration } from "./config";

export interface ImageMatcherResult extends MatcherResult {
    diffImage?: DiffImage;
    changedRelative?: number;
    totalPixels?: number;
    changedPixels?: number;
    testFileName?: string;
    snapshotNumber?: number;
}

export interface ToMatchImageSnapshotParameters {
    /**
     * Can be used to override the path to which the snapshot image
     * will be written.
     */
    path?: string;
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
    configuration: JestScreenshotConfiguration,
): ImageMatcherResult {
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
    const snapshotImagePixels = snapshotImage.width * snapshotImage.height;
    const receivedImagePixels = receivedImage.width * receivedImage.height;
    const totalPixels = Math.max(snapshotImagePixels, receivedImagePixels);
    const changedRelative = changedPixels / totalPixels;
    if (typeof pixelThresholdAbsolute === "number" && changedPixels > pixelThresholdAbsolute) {
        return {
            pass: false,
            message: () =>
                `${preamble}\n\n` +
                `Expected less than ${chalk.green(`${pixelThresholdAbsolute} pixels`)} to have changed, ` +
                `but ${chalk.red(`${changedPixels} pixels`)} changed.`,
            diffImage,
            changedRelative,
            totalPixels,
            changedPixels,
        };
    }
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
            changedRelative,
            totalPixels,
            changedPixels,
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
 * @param parameters Optional parameters provided to the call of `expect(...).toMatchImageSnapshot(...)`.
 *
 * @return A `MatcherResult` usable by jest.
 */
export function toMatchImageSnapshot(
    received: Buffer,
    configuration: JestScreenshotConfiguration,
    parameters: ToMatchImageSnapshotParameters = {},
): MatcherResult {
    const { snapshotsDir, reportDir, noReport } = configuration;
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
    const snapshotNumber = (snapshotState._counters.get(currentTestName) || 0) as number + 1;
    snapshotState._counters.set(currentTestName, snapshotNumber);
    const snapshotPath = typeof parameters.path === "string" ?
        parameters.path :
        getSnapshotPath(testPath, currentTestName, snapshotState, snapshotsDir);
    const reportPath = getReportPath(testPath, currentTestName, snapshotState, reportDir);
    // Create the path to store the snapshots in.
    mkdirp(path.dirname(snapshotPath));
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

    // If received and expected Buffers are equal, there is no need to perform actual check
    const snapshotBuffer = readFileSync(snapshotPath);
    if (snapshotBuffer.equals(received)) {
        return { pass: true };
    }

    // Decode the new image and read the snapshot.
    const snapshotImage = decode(snapshotBuffer);
    const receivedImage = decode(received);
    // Perform the actual diff of the images.
    const {
        pass,
        message,
        diffImage,
        changedRelative,
        totalPixels,
        changedPixels,
    } = checkImages(snapshotImage, receivedImage, snapshotNumber, configuration);
    if (!pass) {
        if (_updateSnapshot === "all") {
            snapshotState.updated++;
            writeFileSync(snapshotPath, received);
            return { pass: true };
        }
        if (!noReport) {
            mkdirp(reportPath);
            const receivedPath = path.join(reportPath, "received.png");
            const diffPath = path.join(reportPath, "diff.png");
            const snapshotPathReport = path.join(reportPath, "snapshot.png");
            writeFileSync(receivedPath, received);
            writeFileSync(snapshotPathReport, readFileSync(snapshotPath));
            writePngFileSync(diffPath, diffImage.data, diffImage);
            writeFileSync(path.join(reportPath, "info.json"), JSON.stringify({
                testName: currentTestName,
                message: message(),
                changedRelative,
                totalPixels,
                changedPixels,
                testFileName: path.relative(process.cwd(), testPath),
                snapshotNumber,
                receivedPath: path.relative(getReportDir(reportDir), receivedPath),
                diffPath: path.relative(getReportDir(reportDir), diffPath),
                snapshotPath: path.relative(getReportDir(reportDir), snapshotPathReport),
                width: Math.max(snapshotImage.width, receivedImage.width),
                height: Math.max(snapshotImage.height, receivedImage.height),
            }));
        }
    }
    return { pass, message };
}
