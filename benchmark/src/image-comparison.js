const Benchmark = require("benchmark");
const fs = require("fs");
const childProcess = require("child_process")
const drawChart = require("./chart");

module.exports = () => new Promise(resolve => {
    console.log("Benchmarking image comparison")
    const suite = new Benchmark.Suite();
    suite
        .add("jest-screenshot", () => {
            try {
                childProcess.execSync("npm run test:jest-screenshot");
                [
                    "suite-jest-screenshot-js-fails-to-match-the-snapshot-0-1-0a0c2.snap.png",
                    "suite-jest-screenshot-js-fails-to-match-the-snapshot-1-1-2355f.snap.png",
                    "suite-jest-screenshot-js-fails-to-match-the-snapshot-2-1-8f3a7.snap.png",
                    "suite-jest-screenshot-js-fails-to-match-the-snapshot-3-1-1607c.snap.png",
                    "suite-jest-screenshot-js-fails-to-match-the-snapshot-4-1-3bca5.snap.png",
                    "suite-jest-screenshot-js-fails-to-match-the-snapshot-5-1-c12b8.snap.png",
                    "suite-jest-screenshot-js-fails-to-match-the-snapshot-6-1-88298.snap.png",
                    "suite-jest-screenshot-js-fails-to-match-the-snapshot-7-1-a71cb.snap.png",
                    "suite-jest-screenshot-js-fails-to-match-the-snapshot-8-1-d8161.snap.png",
                    "suite-jest-screenshot-js-fails-to-match-the-snapshot-9-1-d2e89.snap.png",
                ].forEach(fileName => {
                    fs.unlinkSync(`${__dirname}/__snapshots__/${fileName}`);
                });
            } catch (err) {}
        })
        .add("jest-image-snapshot", () => {
            try {
                childProcess.execSync("npm run test:jest-image-snapshot");
                [
                    "suite-jest-image-snapshot-js-creates-a-new-snapshot-0-1-snap.png",
                    "suite-jest-image-snapshot-js-creates-a-new-snapshot-1-1-snap.png",
                    "suite-jest-image-snapshot-js-creates-a-new-snapshot-2-1-snap.png",
                    "suite-jest-image-snapshot-js-creates-a-new-snapshot-3-1-snap.png",
                    "suite-jest-image-snapshot-js-creates-a-new-snapshot-4-1-snap.png",
                    "suite-jest-image-snapshot-js-creates-a-new-snapshot-5-1-snap.png",
                    "suite-jest-image-snapshot-js-creates-a-new-snapshot-6-1-snap.png",
                    "suite-jest-image-snapshot-js-creates-a-new-snapshot-7-1-snap.png",
                    "suite-jest-image-snapshot-js-creates-a-new-snapshot-8-1-snap.png",
                    "suite-jest-image-snapshot-js-creates-a-new-snapshot-9-1-snap.png",
                ].forEach(fileName => {
                    fs.unlinkSync(`${__dirname}/__image_snapshots__/${fileName}`);
                });
            } catch (err) {}
        })
        .on("cycle", event => console.log(String(event.target)))
        .on("complete", () => drawChart(suite, `${__dirname}/../benchmark-image-comparison.png`, resolve))
        .run();
});
