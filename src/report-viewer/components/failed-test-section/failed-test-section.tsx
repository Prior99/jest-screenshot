import * as React from "react";
import bulma from "bulma";
import classNames from "classnames/bind";
import { FailedTest } from "../../../reporter-types";
import { Snapshot } from "../snapshot";

const cx = classNames.bind(bulma);

export interface FailedTestSectionProps {
    failedTest: FailedTest;
}

export class FailedTestSection extends React.Component<FailedTestSectionProps> {
    private get failedTest() { return this.props.failedTest; }
    public render() {
        const { titles } = this.failedTest;
        return (
            <section className={cx("section")}>
                <p className={cx("subtitle", "is-4")}>
                    {this.failedTest.titles.join(" ")}
                </p>
                {
                    this.failedTest.failedSnapshots.map(snapshot => {
                        return (
                            <Snapshot
                                key={`${snapshot.testName}-${snapshot.snapshotNumber}`}
                                snapshot={snapshot}
                            />
                        );
                    })
                }
            </section>
        );
    }
}
