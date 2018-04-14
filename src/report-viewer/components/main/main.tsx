import * as React from "react";
import * as bulma from "bulma";
import * as classNames from "classnames/bind";
import { inject, external } from "tsdi";
import { observer } from "mobx-react";
import { computed } from "mobx";
import { StoreTestFiles, StoreUi } from "../../store";
import { FailedTestSection } from "../failed-test-section";

const cx = classNames.bind(bulma);

@observer @external
export class Main extends React.Component {
    @inject private testFiles: StoreTestFiles;
    @inject private ui: StoreUi;

    @computed private get headline() { return this.testFiles.activeFile.testFilePath; }

    public render() {
        const classes = cx({
            "column": true,
            "is-9": this.ui.menuVisible,
            "is-12": !this.ui.menuVisible,
            "section": true,
            "is-fullheight": true,
        });
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
