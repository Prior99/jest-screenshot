import * as React from "react";
import * as bulma from "bulma";
import * as classNames from "classnames/bind";
import { inject, external } from "tsdi";
import { observer } from "mobx-react";
import { computed } from "mobx";
import { StoreTestFiles } from "../../store";
import { FailedTestSection } from "../failed-test-section";

const cx = classNames.bind(bulma);

@observer @external
export class Main extends React.Component {
    @inject private testFiles: StoreTestFiles;

    @computed private get headline() { return this.testFiles.activeFile.testFilePath; }

    public render() {
        const classes = cx(
            "column",
            "is-9",
            "section",
            "is-fullheight",
        );
        if (!this.testFiles.activeFile) { return null; }
        return (
            <main className={classes}>
                <h1 className={cx("title")}>{this.headline}</h1>
                {
                    this.testFiles.activeFile.failedTests.map(failedTest => {
                        return (
                            <FailedTestSection
                                key={`${failedTest.titles.join("-")}`}
                                failedTest={failedTest}
                            />
                        );
                    })
                }
            </main>
        );
    }
}
