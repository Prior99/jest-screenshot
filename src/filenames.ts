import { SnapshotState } from "./jest";
import * as path from "path";
import { createHash } from "crypto";
import kebabCase = require("lodash.kebabcase"); // tslint:disable-line

const suffix = ".snap.png";
const checksumLength = 5;
const maxTestFilenameLength = 75;
// Windows allows a maximum of 255 characters. The suffix length as well as the length of two `-` and
// the length of the md5-hash need to be subtracted.
const maxFilenameLength = 255 - suffix.length - checksumLength - 3 - maxTestFilenameLength;

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
export function getSnapshotFileName(testPath: string, currentTestName: string, snapshotState: SnapshotState) {
    // MD5 Hash generator.
    const md5 = createHash("md5");
    // Counter for the n-th snapshot in the test.
    const counter = snapshotState._counters.get(currentTestName);
    // Generate the test filename and identifier path for the maximum windows filename length.
    const testFileNamePart = kebabCase(path.basename(testPath).substr(0, 75));
    const identifierPart = kebabCase(currentTestName.substr(0, maxFilenameLength - String(counter).length));
    const fileNameStart = `${testFileNamePart}-${identifierPart}-${counter}`;
    const checksum = md5.update(fileNameStart).digest("hex").substr(0, 5);
    return `${fileNameStart}-${checksum}.snap.png`;
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
) {
    const fileName = getSnapshotFileName(testPath, currentTestName, snapshotState);
    return path.join(path.dirname(testPath), snapshotsDir || "__snapshots__", fileName);
}

export function getReportDir(reportDir?: string) {
    return path.join(
        process.cwd(),
        reportDir || "jest-screenshot-report",
    );
}

export function getReportPath(
    testPath: string,
    currentTestName: string,
    snapshotState: SnapshotState,
    reportDir?: string,
) {
    const counter = snapshotState._counters.get(currentTestName);
    return path.join(
        getReportDir(reportDir),
        "reports",
        getSnapshotFileName(testPath, currentTestName, snapshotState),
    );
}
