import * as React from "react";
import * as bulma from "bulma";
import { observer } from "mobx-react";
import { observable, action, computed } from "mobx";
import * as classNames from "classnames/bind";
import { bind } from "lodash-decorators";
import * as css from "./image-diff-viewer.scss";
import { DiffSlider } from "./diff-slider";
import { DiffBlend } from "./diff-blend";
import { DiffSideBySide } from "./diff-side-by-side";

const cx = classNames.bind({ ...bulma, ...css });

export interface ImageDiffViewerProps {
    received: string;
    snapshot: string;
    diff: string;
    width: number;
    height: number;
}

enum Tab {
    Slider = "slider",
    SideBySide = "side-by-side",
    Blend = "blend",
}

@observer
export class ImageDiffViewer extends React.Component<ImageDiffViewerProps> {
    @observable private tab = Tab.Slider;

    @computed private get sliderTabActive() { return this.tab === Tab.Slider; }

    @computed private get sideBySideTabActive() { return this.tab === Tab.SideBySide; }

    @computed private get blendTabActive() { return this.tab === Tab.Blend; }

    @bind @action private handleSliderTabClick() { this.tab = Tab.Slider; }

    @bind @action private handleBlendTabClick() { this.tab = Tab.Blend; }

    @bind @action private handleSideBySideTabClick() { this.tab = Tab.SideBySide; }

    private renderDiff() {
        const { received, snapshot, diff, width, height } = this.props;
        switch (this.tab) {
            case Tab.Slider:
                return (
                    <DiffSlider
                        received={received}
                        snapshot={snapshot}
                        diff={diff}
                        width={width}
                        height={height}
                    />
                );
            case Tab.Blend:
                return (
                    <DiffBlend
                        received={received}
                        snapshot={snapshot}
                        diff={diff}
                        width={width}
                        height={height}
                    />
                );
            case Tab.SideBySide:
                return (
                    <DiffSideBySide
                        received={received}
                        snapshot={snapshot}
                        diff={diff}
                        width={width}
                        height={height}
                    />
                );
        }
    }

    public render() {
        return (
            <article>
                <div className={cx("tabs", "is-toggle", "is-center", "is-fullwidth")}>
                    <ul>
                        <li className={cx({ "is-active": this.sliderTabActive })}>
                            <a onClick={this.handleSliderTabClick}>Slider</a>
                        </li>
                        <li className={cx({ "is-active": this.sideBySideTabActive })}>
                            <a onClick={this.handleSideBySideTabClick}>Side-by-side</a>
                        </li>
                        <li className={cx({ "is-active": this.blendTabActive })}>
                            <a onClick={this.handleBlendTabClick}>Blend</a>
                        </li>
                    </ul>
                </div>
                {this.renderDiff()}
            </article>
        );
    }
}
