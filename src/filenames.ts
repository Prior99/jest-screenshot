import { SnapshotState } from "./jest";
import { IdentifierGenerator, ReportPathGenerator } from "./to-match-image-snapshot";
import * as path from "path";
import kebabCase = require("lodash.kebabcase"); // tslint:disable-line

/**
 * Calculates the filename for an individual image snapshot file.
 * Depending on the configuration the provided `identifier` generator will be used
 * or a default identifier will be generated.
 *
 * @param testPath The `testPath` from the jest test configuration, leading to the test file.
 * @param currentTestName The `currentTestName` from the jest test configuration,
 *     the name of the current `it`/`describe` test.
 * @param snapshotState The `snapshotState` from the jest test configuration.
 *
 * @return A string used as a filename for the current snapshot.
 */
export function getSnapshotFileName(
    testPath: string,
    currentTestName: string,
    snapshotState: SnapshotState,
    identifier?: IdentifierGenerator,
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

/**
 * Calculates the absolute path to an individual image snapshot file.
 *
 * @param testPath The `testPath` from the jest test configuration, leading to the test file.
 * @param currentTestName The `currentTestName` from the jest test configuration,
 *     the name of the current `it`/`describe` test.
 * @param snapshotState The `snapshotState` from the jest test configuration.
 *
 * @return A string with the absolute path to the current snapshot.
 */
export function getSnapshotPath(
    testPath: string,
    currentTestName: string,
    snapshotState: SnapshotState,
    snapshotsDir?: string,
    identifier?: IdentifierGenerator,
) {
    const fileName = getSnapshotFileName(testPath, currentTestName, snapshotState, identifier);
    return path.join(path.dirname(testPath), snapshotsDir || "__snapshots__", fileName);
}

export function getReportPath(
    testPath: string,
    currentTestName: string,
    snapshotState: SnapshotState,
    reportPath: ReportPathGenerator,
) {
    const counter = (snapshotState._counters.get(currentTestName) || 0) + 1;
    if (reportPath === null) { return; }
    if (typeof reportPath === "undefined") {
        return path.join(
            "jest-screenshot-reports",
            path.basename(testPath),
            kebabCase(currentTestName),
            String(counter),
        );
    }
    return reportPath(testPath, currentTestName, counter);
}
