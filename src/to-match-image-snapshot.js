"use strict";
exports.__esModule = true;
var node_libpng_1 = require("node-libpng");
var native_image_diff_1 = require("native-image-diff");
var jest_1 = require("./jest");
var path = require("path");
var lodash_kebabcase_1 = require("lodash.kebabcase");
function getSnapshotFileName(testPath, currentTestName, snapshotState, _a) {
    var identifier = _a.identifier;
    var counter = (snapshotState._counters.get(currentTestName) || 0) + 1;
    if (typeof identifier === "function") {
        var fileName = identifier(testPath, currentTestName, counter);
        if (fileName.toLowerCase().endsWith(".snap.png")) {
            return fileName;
        }
        return fileName + ".snap.png";
    }
    if (typeof identifier !== "undefined") {
        throw new Error("Jest: Invalid configuration for `.toMatchImageSnapshot`: `identifier` must be a function.");
    }
    return lodash_kebabcase_1["default"](path.basename(testPath)) + "-" + lodash_kebabcase_1["default"](currentTestName) + "-" + counter;
}
function getSnapshotPath(testPath, currentTestName, snapshotState, configuration) {
    var snapshotsDir = configuration.snapshotsDir;
    var fileName = getSnapshotFileName(testPath, currentTestName, snapshotState, configuration);
    return path.join(path.dirname(testPath), snapshotsDir || "__snapshots__", fileName);
}
function toMatchImageSnapshot(received, configuration) {
    if (!jest_1.isJestTestConfiguration(this)) {
        throw new Error("Jest: Attempted to call toMatchImageSnapshot outside of Jest context.");
    }
    var _a = this, testPath = _a.testPath, currentTestName = _a.currentTestName, isNot = _a.isNot;
    var snapshotState = this.snapshotState;
    console.log(snapshotState, this);
    if (isNot) {
        throw new Error("Jest: `.not` cannot be used with `.toMatchImageSnapshot()`.");
    }
    var colorThreshold = configuration.colorThreshold, detectAntialiasing = configuration.detectAntialiasing;
    native_image_diff_1.diffImages({
        image1: node_libpng_1.decode(received),
        image2: node_libpng_1.readPngFileSync(getSnapshotPath(testPath, currentTestName, snapshotState, configuration)),
        colorThreshold: colorThreshold,
        detectAntialiasing: detectAntialiasing
    });
}
exports.toMatchImageSnapshot = toMatchImageSnapshot;
function configureToMatchImageSnapshot(configuration) {
    if (configuration === void 0) { configuration = {}; }
    return function (received) {
        return toMatchImageSnapshot(received, configuration);
    };
}
exports.configureToMatchImageSnapshot = configureToMatchImageSnapshot;
