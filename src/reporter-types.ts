import { ImageMatcherResult } from "./to-match-image-snapshot";

export interface FailedTest {
    titles: string[];
    failedSnapshots: FailedSnapshotInfo[];
}

export interface FileReport {
    testFilePath: string;
    failedTests: FailedTest[];
}

export interface ReportMetadata {
    files: FileReport[];
}

export interface FailedSnapshotInfo {
    testName: string;
    message: string;
    changedRelative: number;
    totalPixels: number;
    changedPixels: number;
    testFileName: string;
    snapshotNumber: number;
    receivedPath: string;
    diffPath: string;
    snapshotPath: string;
    width: number;
    height: number;
}
