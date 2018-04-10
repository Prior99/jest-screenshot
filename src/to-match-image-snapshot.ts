import { decode, readPngFileSync, writePngFileSync, PngImage } from "node-libpng";
import { diffImages } from "native-image-diff";
import chalk from "chalk";
import { existsSync, writeFileSync } from "fs";
import { getSnapshotPath } from "./filenames";
import { SnapshotState, isJestTestConfiguration, MatcherResult } from "./jest";

export interface ToMatchImageSnapshotConfiguration {
    detectAntialiasing?: boolean;
    colorThreshold?: number;
    pixelThresholdAbsolute?: number;
    pixelThresholdRelative?: number;
    identifier?: ((testPath: string, currentTestName: string, counter: number) => string);
    snapshotsDir?: string;
}

function checkImages(
    snapshotImage: PngImage,
    receivedImage: PngImage,
    snapshotNumber: number,
    configuration: ToMatchImageSnapshotConfiguration,
): MatcherResult {
    const {
        colorThreshold,
        detectAntialiasing,
        pixelThresholdAbsolute,
        pixelThresholdRelative,
    } = configuration;
    // Perform the actual image diff.
    const { pixels: changedPixels, image } = diffImages({
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
        };
    }
    return { pass: true };
}

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
    const { pass, message } = checkImages(snapshotImage, receivedImage, snapshotNumber, configuration);
    // If the user specified `-u` and the snapshot changed, update the stored snapshot.
    if (!pass && _updateSnapshot === "all") {
        snapshotState.updated++;
        writeFileSync(snapshotPath, received);
        return { pass: true };
    }
    return { pass, message };
}
