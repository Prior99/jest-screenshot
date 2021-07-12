import * as React from "react";
import bulma from "bulma";
import { observer } from "mobx-react";
import { external, inject, initialize } from "tsdi";
import { observable, action, computed, reaction } from "mobx";
import classNames from "classnames/bind";
import { bind } from "lodash-decorators";
import { StoreUi } from "../../../store";
import css from "./diff-slider.scss";

const cx = classNames.bind({ ...bulma, ...css });

export interface DiffSliderProps {
    received: string;
    snapshot: string;
    diff: string;
    width: number;
    height: number;
}

@external @observer
export class DiffSlider extends React.Component<DiffSliderProps> {
    @inject private ui: StoreUi;

    @observable private dragging = false;
    @observable private sliderX = 0.5;
    @observable private diffOpacity = 0.5;

    private container: HTMLDivElement;
    private imageReceived: HTMLImageElement;
    private imageSnapshot: HTMLImageElement;
    private imageDiff: HTMLImageElement;

    @initialize
    private initialize() {
        const rerender = () => {
            this.forceUpdate();
            this.adjustSizes();
        };
        window.addEventListener("resize", rerender);
        reaction(() => this.ui.menuVisible, () => {
            setTimeout(() => rerender(), 0);
        });
    }

    @computed private get aspectRatio() { return this.props.height / this.props.width; }

    @bind @action private handleDragStart(event: React.MouseEvent<HTMLDivElement>) {
        this.dragging = true;
        this.slide(event);
    }

    @bind @action private handleDragStop() { this.dragging = false; }

    @bind @action private handleDrag(event: React.MouseEvent<HTMLDivElement>) {
        if (!this.dragging) { return; }
        this.slide(event);
    }

    @bind private slide(event: React.MouseEvent<HTMLDivElement>) {
        const { left, width } = this.container.getBoundingClientRect();
        this.sliderX = (event.clientX - left) / width;
        event.stopPropagation();
        event.preventDefault();
    }

    @bind private refContainer(element: HTMLDivElement) {
        this.container = element;
        this.adjustSizes();
    }

    @bind private refImageReceived(element: HTMLImageElement) {
        this.imageReceived = element;
        this.adjustSizes();
    }

    @bind private refImageSnapshot(element: HTMLImageElement) {
        this.imageSnapshot = element;
        this.adjustSizes();
    }

    @bind private refImageDiff(element: HTMLImageElement) {
        this.imageDiff = element;
        this.adjustSizes();
    }

    @bind private adjustSizes() {
        if (!this.imageDiff || !this.container || !this.imageReceived || !this.imageSnapshot) {
            return;
        }
        const { width: containerWidth } = this.container.getBoundingClientRect();
        const containerHeight = this.aspectRatio * containerWidth;
        this.container.style.height = `${containerHeight}px`;
        [this.imageDiff, this.imageReceived, this.imageSnapshot].forEach(image => {
            image.width = containerWidth;
            image.height = containerHeight;
            image.style.width = `${containerWidth}px`;
            image.style.height = `${containerHeight}px`;
        });
    }

    @bind @action private handleDiffOpacity(event: React.SyntheticEvent<HTMLInputElement>) {
        this.diffOpacity = Number(event.currentTarget.value);
    }

    public render() {
        const { received, snapshot, diff } = this.props;
        return (
            <>
                <nav className={cx("level", "settings")}>
                    <div className={cx("level-item", "has-text-centered")}>
                        <div>
                            <div className={cx("heading")}>Diff Opacity</div>
                            <input
                                className={cx("title")}
                                type="range"
                                min={0}
                                max={1}
                                step="any"
                                value={this.diffOpacity}
                                onChange={this.handleDiffOpacity}
                            />
                        </div>
                    </div>
                </nav>
                <div
                    onMouseDown={this.handleDragStart}
                    onMouseLeave={this.handleDragStop}
                    onMouseUp={this.handleDragStop}
                    onMouseMove={this.handleDrag}
                    className={cx("viewer-container")}
                    ref={this.refContainer}
                >
                    <div className={cx("slider")} style={{ left: `${this.sliderX * 100}%` }}>
                        <div className={cx("top")} />
                        <div className={cx("bottom")} />
                    </div>
                    <div className={cx("viewer-diff")}>
                        <img ref={this.refImageDiff} src={diff} style={{ opacity: this.diffOpacity }} />
                    </div>
                    <div
                        className={cx("viewer-received")}
                        style={{ width: `${this.sliderX * 100}%` }}
                    >
                        <img ref={this.refImageReceived} src={received} />
                    </div>
                    <div className={cx("viewer-snapshot")}>
                        <img ref={this.refImageSnapshot} src={snapshot} />
                    </div>
                </div>
            </>
        );
    }
}
