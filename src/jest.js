"use strict";
exports.__esModule = true;
function isSnapshotState(obj) {
    if (typeof obj !== "object") {
        return false;
    }
    var _counters = obj._counters;
    if (typeof _counters !== "object") {
        return false;
    }
    if (typeof _counters.get !== "function") {
        return false;
    }
    return true;
}
exports.isSnapshotState = isSnapshotState;
function isJestTestConfiguration(obj) {
    if (typeof obj !== "object") {
        return false;
    }
    var snapshotState = obj.snapshotState, testPath = obj.testPath, currentTestName = obj.currentTestName, isNot = obj.isNot;
    if (typeof testPath !== "string") {
        return false;
    }
    if (typeof currentTestName !== "string") {
        return false;
    }
    if (typeof isNot !== "boolean") {
        return false;
    }
    if (!isSnapshotState(snapshotState)) {
        return false;
    }
    return true;
}
exports.isJestTestConfiguration = isJestTestConfiguration;
