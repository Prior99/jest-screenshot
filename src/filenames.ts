import { SnapshotState } from "./jest";
import { ToMatchImageSnapshotConfiguration } from "./to-match-image-snapshot";
import * as path from "path";
import kebabCase from "lodash.kebabcase";

export function getSnapshotFileName(
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

export function getSnapshotPath(
    testPath: string,
    currentTestName: string,
    snapshotState: SnapshotState,
    configuration: ToMatchImageSnapshotConfiguration,
) {
    const { snapshotsDir } = configuration;
    const fileName = getSnapshotFileName(testPath, currentTestName, snapshotState, configuration);
    return path.join(path.dirname(testPath), snapshotsDir || "__snapshots__", fileName);
}
