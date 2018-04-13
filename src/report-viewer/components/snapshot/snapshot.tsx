import * as React from "react";
import * as bulma from "bulma";
import Ansi = require("ansi-to-react"); // tslint:disable-line
import * as classNames from "classnames/bind";
import { FailedSnapshotInfo } from "../../../reporter-types";
import { LevelItem } from "../level-item";
import { ImageDiffViewer } from "../../image-diff-viewer";

const cx = classNames.bind(bulma);

export interface SnapshotProps {
    snapshot: FailedSnapshotInfo;
}

export class Snapshot extends React.Component<SnapshotProps> {
    private get snapshot() { return this.props.snapshot; }

    public render() {
        const { receivedPath, snapshotPath, diffPath, width, height } = this.snapshot;
        return (
            <article>
                <nav className={cx("level")}>
                    <LevelItem name="Total Pixels" value={String(this.snapshot.totalPixels)}/>
                    <LevelItem name="Changed Pixels" value={String(this.snapshot.changedPixels)}/>
                    <LevelItem name="Difference" value={`${(this.snapshot.changedRelative * 100).toFixed(2)}%`}/>
                </nav>
                <Ansi>
                    {this.snapshot.message}
                </Ansi>
                <ImageDiffViewer
                    received={receivedPath}
                    snapshot={snapshotPath}
                    diff={diffPath}
                    width={width}
                    height={height}
                />
            </article>
        );
    }
}
