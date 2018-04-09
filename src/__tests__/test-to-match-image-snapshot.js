"use strict";
exports.__esModule = true;
var __1 = require("..");
var fs_1 = require("fs");
describe("toMatchImageSnapshot", function () {
    beforeAll(function () {
        expect.extend(__1.jestScreenshot());
    });
    it("detects a matching snapshot as matching", function () {
        expect(fs_1.readFileSync(__dirname + "/fixtures/red-rectangle-example-gradient.png")).toMatchImageSnapshot();
    });
});
