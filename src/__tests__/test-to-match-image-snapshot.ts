import { jestScreenshot } from "..";
import { readFileSync } from "fs";

describe("toMatchImageSnapshot", () => {
    beforeAll(() => {
        expect.extend(jestScreenshot());
    });

    it("detects a matching snapshot as matching", () => {
        expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-gradient.png`)).toMatchImageSnapshot();
    });
});
