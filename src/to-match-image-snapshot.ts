import { decode, readPngFileSync, writePngFileSync, PngImage } from "node-libpng";
import { diffImages } from "native-image-diff";
import { SnapshotState, isJestTestConfiguration, MatcherResult } from "./jest";
import * as path from "path";
import kebabCase from "lodash.kebabcase";
import chalk from "chalk";
import { existsSync, writeFileSync } from "fs";

export interface ToMatchImageSnapshotConfiguration {
    detectAntialiasing?: boolean;
    colorThreshold?: number;
    pixelThresholdAbsolute?: number;
    pixelThresholdRelative?: number;
    identifier?: ((testPath: string, currentTestName: string, counter: number) => string);
    snapshotsDir?: string;
}

function getSnapshotFileName(
    testPath: string,
    currentTestName: string,
    snapshotState: SnapshotState,
    { identifier }: ToMatchImageSnapshotConfiguration,
) {
    const counter = (snapshotState._counters.get(currentTestName) || 0) + 1;
    if (typeof identifier === "function") {
        const fileName = identifier(testPath, currentTestName, counter);
        if (fileName.toLowerCase().endsWith(".snap.png")) {
            return fileName;
        }
        return `${fileName}.snap.png`;
    }
    if (typeof identifier !== "undefined") {
        throw new Error("Jest: Invalid configuration for `.toMatchImageSnapshot`: `identifier` must be a function.");
    }
    return `${kebabCase(path.basename(testPath))}-${kebabCase(currentTestName)}-${counter}.snap.png`;
}

function getSnapshotPath(
    testPath: string,
    currentTestName: string,
    snapshotState: SnapshotState,
    configuration: ToMatchImageSnapshotConfiguration,
) {
    const { snapshotsDir } = configuration;
    const fileName = getSnapshotFileName(testPath, currentTestName, snapshotState, configuration);
    return path.join(path.dirname(testPath), snapshotsDir || "__snapshots__", fileName);
}

function checkImages(
    snapshotImage: PngImage,
    receivedImage: PngImage,
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
    if (typeof pixelThresholdAbsolute === "number" && changedPixels > pixelThresholdAbsolute) {
        return {
            pass: false,
            message: () =>
                `Expected image to have less than ${chalk.green(String(pixelThresholdAbsolute))} pixels changed, ` +
                `but ${chalk.red(String(changedPixels))} pixels changed.`,
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
                `Expected image to have less than ${chalk.green(percentThreshold)}% changed, ` +
                `but ${chalk.red(percentChanged)}% changed.`,
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
        throw new Error("Jest: Attempted to call toMatchImageSnapshot outside of Jest context.");
    }
    const { testPath, currentTestName, isNot } = this;
    if (isNot) {
        throw new Error("Jest: `.not` cannot be used with `.toThrowErrorMatchingSnapshot()`.");
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
            message: () => `Snapshot missing.`,
        };
    }
    // Decode the new image and read the snapshot.
    const snapshotImage = readPngFileSync(snapshotPath);
    const receivedImage = decode(received);
    // Perform the actual diff of the images.
    const { pass, message } = checkImages(snapshotImage, receivedImage, configuration);
    // If the user specified `-u` and the snapshot changed, update the stored snapshot.
    if (!pass && _updateSnapshot === "all") {
        snapshotState.updated++;
        writeFileSync(snapshotPath, received);
        return { pass: true };
    }
    return { pass, message };
}
