import { jestScreenshot } from "..";
import { toMatchImageSnapshot } from "../to-match-image-snapshot";
import { readFileSync } from "fs";

describe("toMatchImageSnapshot", () => {
    beforeAll(() => {
        expect.extend(jestScreenshot());
    });

    describe("with no threshold provided", () => {
        it("detects a matching snapshot as matching", () => {
            expect(() => {
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-gradient.png`)).toMatchImageSnapshot();
            }).not.toThrowError();
        });

        [
            { colorThreshold: 0.0 },
            { colorThreshold: 0.1 },
            { colorThreshold: 0.5 },
            { colorThreshold: 0.6 },
        ].forEach(({ colorThreshold }) => {
            it(`with a color threshold of ${colorThreshold} detects the snapshot as not matching`, () => {
                expect.extend(jestScreenshot({ colorThreshold }));
                expect(() => {
                    expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
                }).toThrowErrorMatchingSnapshot();
            });
        });

        [
            { colorThreshold: 0.7 },
            { colorThreshold: 1.0 },
        ].forEach(({ colorThreshold }) => {
            it(`with a color threshold of ${colorThreshold} detects the snapshot as matching`, () => {
                expect.extend(jestScreenshot({ colorThreshold }));
                expect(() => {
                    expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
                }).not.toThrowError();
            });
        });
    });

    describe("with an absolute threshold provided", () => {
        const colorThreshold = 0.6;

        it("fails with an absolute threshold of 204", () => {
            const pixelThresholdAbsolute = 204;
            expect.extend(jestScreenshot({ colorThreshold, pixelThresholdAbsolute }));
            expect(() => {
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
            }).toThrowErrorMatchingSnapshot();
        });

        it("passes with an absolute threshold of 205", () => {
            const pixelThresholdAbsolute = 205;
            expect.extend(jestScreenshot({ colorThreshold, pixelThresholdAbsolute }));
            expect(() => {
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
            }).not.toThrowError();
        });
    });

    describe("with `.not` specified", () => {
        it("fails always", () => {
            expect(() => {
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).not.toMatchImageSnapshot();
            }).toThrowErrorMatchingSnapshot();
        });
    });

    describe("when called outside of a jest unit test context", () => {
        it("fails", () => {
            expect(function() {
                toMatchImageSnapshot(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`), {});
            }.bind({})).toThrowErrorMatchingSnapshot();
        });
    });
});
