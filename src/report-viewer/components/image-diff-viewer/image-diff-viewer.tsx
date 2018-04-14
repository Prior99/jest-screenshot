import * as React from "react";
import * as bulma from "bulma";
import { observer } from "mobx-react";
import { observable, action, computed } from "mobx";
import * as classNames from "classnames/bind";
import * as css from "./image-diff-viewer.scss";
import { bind } from "lodash-decorators";

const cx = classNames.bind({ ...bulma, ...css });

export interface ImageDiffViewerProps {
    received: string;
    snapshot: string;
    diff: string;
    width: number;
    height: number;
}

@observer
export class ImageDiffViewer extends React.Component<ImageDiffViewerProps> {
    @observable private dragging = false;
    @observable private sliderX = 0.5;

    private container: HTMLDivElement;
    private imageReceived: HTMLImageElement;
    private imageSnapshot: HTMLImageElement;
    private imageDiff: HTMLImageElement;

    constructor(props: ImageDiffViewerProps) {
        super(props);
        window.addEventListener("resize", () => {
            this.forceUpdate();
            this.adjustSizes();
        });
    }

    private slide(event: React.MouseEvent<HTMLDivElement>) {
        const { left, width } = event.currentTarget.getBoundingClientRect();
        this.sliderX = (event.clientX - left) / width;
        event.stopPropagation();
        event.preventDefault();
    }

    @action.bound private handleDragStart(event: React.MouseEvent<HTMLDivElement>) {
        this.dragging = true;
        this.slide(event);
    }

    @action.bound private handleDragStop() { this.dragging = false; }

    @action.bound private handleDrag(event: React.MouseEvent<HTMLDivElement>) {
        if (!this.dragging) { return; }
        this.slide(event);
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

    @computed private get aspectRatio() {
        return this.props.height / this.props.width;
    }

    private adjustSizes() {
        if (!this.imageDiff || !this.container || !this.imageReceived || !this.imageSnapshot) {
            return;
        }
        const { width: containerWidth } = this.container.getBoundingClientRect();
        const containerHeight = this.aspectRatio * containerWidth;
        this.container.style.height = `${containerHeight}px`;
        [this.imageDiff, this.imageReceived, this.imageSnapshot].forEach(image => {
            image.width = containerWidth;
            image.height = containerHeight - 2;
            image.style.width = `${containerWidth}px`;
            image.style.height = `${containerHeight - 2}px`;
        });
    }

    public render() {
        const { received, snapshot, diff } = this.props;
        return (
            <article>
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
                        <img ref={this.refImageDiff} src={diff} />
                    </div>
                    <div
                        className={cx("viewer-received")}
                        style={{ width: `${this.sliderX * 100}%`,}}
                    >
                        <img ref={this.refImageReceived} src={received} />
                    </div>
                    <div className={cx("viewer-snapshot")}>
                        <img ref={this.refImageSnapshot} src={snapshot} />
                    </div>
                </div>
            </article>
        );
    }
}
