import * as React from "react";
import * as bulma from "bulma";
import * as classNames from "classnames/bind";
import * as css from "./image-diff-viewer.scss";

const cx = classNames.bind({ ...bulma, ...css });

export interface ImageDiffViewerProps {
    received: string;
    snapshot: string;
    diff: string;
    width: number;
    height: number;
}

export class ImageDiffViewer extends React.Component<ImageDiffViewerProps> {
    public render() {
        const { received, snapshot, diff, width, height } = this.props;
        return (
            <article>
                <div className={cx("viewer-container")}>
                    <div
                        className={cx("viewer-diff")}
                        style={{ backgroundImage: `url(${diff})`, width, height }}
                    />
                    <div
                        className={cx("viewer-received")}
                        style={{ backgroundImage: `url(${received})`, width, height }}
                    />
                    <div
                        className={cx("viewer-snapshot")}
                        style={{ backgroundImage: `url(${snapshot})`, width, height }}
                    />
                </div>
            </article>
        );
    }
}
