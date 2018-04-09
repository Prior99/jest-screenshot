"use strict";
exports.__esModule = true;
var to_match_image_snapshot_1 = require("./to-match-image-snapshot");
function jestScreenshot(configuration) {
    return {
        toMatchImageSnapshot: to_match_image_snapshot_1.configureToMatchImageSnapshot(configuration)
    };
}
exports.jestScreenshot = jestScreenshot;
