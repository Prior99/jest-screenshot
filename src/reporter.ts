import { config, JestScreenshotConfiguration } from "./config";
import { AggregatedResult } from "@jest/test-result";
import { Context } from "@jest/reporters";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, unlinkSync } from "fs";
import * as path from "path";
import { sync as rimrafSync } from "rimraf";
import { getReportPath, getReportDir } from "./filenames";
import { FailedSnapshotInfo, ReportMetadata, FileReport } from "./reporter-types";

const template = (testResults: ReportMetadata) => `<html>
    <head>
        <meta charset="utf-8" />
        <title>Jest Screenshot Report</title>
        <link href="dist/report-viewer.css" type="text/css" rel="stylesheet" />
    </head>
    <body>
        <div id="root"></div>
        <script>
            window.testResults = ${JSON.stringify(testResults)};
        </script>
        <script src="dist/report-viewer.js"></script>
    </body>
</html>`;


export = class JestScreenshotReporter { // tslint:disable-line
    private config = config();

    constructor() {
        const { reportDir: reportDirName } = this.config;
        const reportDir = getReportDir(reportDirName);
        if (existsSync(reportDir)) {
            rimrafSync(reportDir);
        }
    }

    public onRunComplete(contexts: Set<Context>, { testResults, numFailedTests }: AggregatedResult) {
        const { reportDir: reportDirName, noReport } = this.config;
        const reportDir = getReportDir(reportDirName);
        const reportsDir = path.join(reportDir, "reports");
        // if (numFailedTests === 0) { return; }
        if (noReport) { return; }
        if (!existsSync(reportsDir)) { return; }
        const failedSnapshots = readdirSync(reportsDir).map(testPath => {
            const infoFilePath = path.join(reportDir, "reports", testPath, "info.json");
            const info: FailedSnapshotInfo = JSON.parse(readFileSync(infoFilePath, "utf8"));
            return info;
        });
        if (failedSnapshots.length === 0) { return; }
        const fileReports: FileReport[] = testResults.reduce((reports, testFile) => {
            const testFilePath = path.relative(process.cwd(), testFile.testFilePath);
            const failedTests = testFile.testResults.reduce((failed, test) => {
                const { fullName } = test;
                const matchingFailedSnapshots = failedSnapshots.filter(failedSnapshot => {
                    return failedSnapshot.testName === fullName && failedSnapshot.testFileName === testFilePath;
                });
                if (matchingFailedSnapshots.length === 0) { return failed; }
                failed.push({
                    titles: [...test.ancestorTitles, test.title],
                    failedSnapshots: matchingFailedSnapshots,
                });
                return failed;
            }, []);
            if (failedTests.length === 0) { return reports; }
            reports.push({
                testFilePath,
                failedTests,
            });
            return reports;
        }, []);
        writeFileSync(path.join(reportDir, "index.html"), template({
            files: fileReports,
        }));
        try {
            mkdirSync(path.join(reportDir, "dist"));
        } catch (err) {
            // tslint: disable-line
        }
        [
            "report-viewer.js",
            "report-viewer.js.map",
            "report-viewer.css",
            "report-viewer.css.map",
        ].forEach(fileName =>
            writeFileSync(
                path.join(reportDir, "dist", fileName),
                readFileSync(path.join(__dirname, fileName)),
            ),
        );
    }
};
