export interface SnapshotState {
    _counters: Map<string, number>;
    _updateSnapshot: "new" | "all" | "none";
}

export interface JestTestConfiguration {
    snapshotState: SnapshotState;
    testPath: string;
    currentTestName: string;
    isNot: boolean;
}

export interface MatcherResult {
    message?(): string;
    pass: boolean;
}

export function isSnapshotState(obj: any): obj is SnapshotState {
    if (typeof obj !== "object") { return false; }
    const { _counters } = obj;
    if (typeof _counters !== "object") { return false; }
    if (typeof _counters.get !== "function") { return false; }
    return true;
}

export function isJestTestConfiguration(obj: any): obj is JestTestConfiguration {
    if (typeof obj !== "object") { return false; }
    const { snapshotState, testPath, currentTestName, isNot } = obj;
    if (typeof testPath !== "string") { return false; }
    if (typeof currentTestName !== "string") { return false; }
    if (typeof isNot !== "boolean") { return false; }
    if (!isSnapshotState(snapshotState)) { return false; }
    return true;
}
