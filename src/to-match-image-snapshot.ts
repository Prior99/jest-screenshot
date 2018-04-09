import { decode, readPngFileSync, writePngFileSync } from "node-libpng";
import { diffImages } from "native-image-diff";
import { SnapshotState, isJestTestConfiguration, MatcherResult } from "./jest";
import * as path from "path";
import kebabCase from "lodash.kebabcase";

export interface ToMatchImageSnapshotConfiguration {
    readonly detectAntialiasing?: boolean;
    readonly colorThreshold?: number;
    readonly pixelThresholdAbsolute?: number;
    readonly pixelThresholdRelative?: number;
    readonly identifier?: ((testPath: string, currentTestName: string, counter: number) => string);
    readonly snapshotsDir?: string;
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
    return `${kebabCase(path.basename(testPath))}-${kebabCase(currentTestName)}-${counter}`;
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

export function toMatchImageSnapshot(received: Buffer, configuration: ToMatchImageSnapshotConfiguration): MatcherResult {
    if (!isJestTestConfiguration(this)) {
        throw new Error("Jest: Attempted to call toMatchImageSnapshot outside of Jest context.");
    }
    const { testPath, currentTestName, isNot } = this;
    let { snapshotState } = this;
    console.log(snapshotState, this)
    if (isNot) {
        throw new Error("Jest: `.not` cannot be used with `.toMatchImageSnapshot()`.");
    }
    const { colorThreshold, detectAntialiasing } = configuration;
    diffImages({
        image1: decode(received),
        image2: readPngFileSync(getSnapshotPath(testPath, currentTestName, snapshotState, configuration)),
        colorThreshold,
        detectAntialiasing,
    });
}

export function configureToMatchImageSnapshot(configuration: ToMatchImageSnapshotConfiguration = {}) {
    return function (received: Buffer) {
        return toMatchImageSnapshot(received, configuration);
    };
}
