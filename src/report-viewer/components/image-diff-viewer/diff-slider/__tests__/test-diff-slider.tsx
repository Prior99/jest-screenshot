import * as React from "react";
import { shallow, mount } from "enzyme";
import { DiffSlider } from "..";
import { StoreUi } from "../../../../store";

describe("DiffSlider", () => {
    const someProps = {
        received: "reports/something/received.png",
        snapshot: "reports/something/snapshot.png",
        diff: "reports/something/diff.png",
        width: 100,
        height: 100,
    };

    beforeEach(() => {
        HTMLDivElement.prototype.getBoundingClientRect = () => ({
            top: 10, left: 10, right: 10, bottom: 10, width: 100, height: 100,
        } as DOMRect);
    });

    it("looks as expected", () => {
        expect(shallow(<DiffSlider {...someProps} />)).toMatchSnapshot();
    });

    [0, 1, 0.7].forEach(opacity => {
        it(`when setting the diff opacity to ${opacity}`, () => {
            const element = shallow(<DiffSlider {...someProps} />);
            const input = element.find("input[type='range']");
            input.simulate("change", { currentTarget: { value: opacity }});
            expect(element).toMatchSnapshot();
            expect(element.find("div.viewer-container div.viewer-diff img").prop("style").opacity).toBe(opacity);
        });
    });

    it("moves the slider when dragging on the image", () => {
        const element = mount(<DiffSlider {...someProps} />);
        const container = element.find("div.viewer-container");

        container.simulate("mousedown", { clientX: 60 });
        expect(element).toMatchSnapshot();
        expect(element.find("div.slider").prop("style").left).toBe("50%");
        expect(element.find("div.viewer-received").prop("style").width).toBe("50%");

        container.simulate("mousemove", { clientX: 85 });
        expect(element).toMatchSnapshot();
        expect(element.find("div.slider").prop("style").left).toBe("75%");
        expect(element.find("div.viewer-received").prop("style").width).toBe("75%");

        container.simulate("mouseup");
        container.simulate("mousemove", { clientX: 110 });
        expect(element).toMatchSnapshot();
        expect(element.find("div.slider").prop("style").left).toBe("75%");
        expect(element.find("div.viewer-received").prop("style").width).toBe("75%");
    });

    it("reacts to the window resizing", () => {
        const element = mount(<DiffSlider {...someProps} />);
        HTMLDivElement.prototype.getBoundingClientRect = () => ({
            top: 10, left: 10, right: 10, bottom: 10, width: 200, height: 100,
        } as DOMRect);
        window.dispatchEvent(new Event("resize"));
        expect((element.find("div.viewer-container").instance() as any).style.height).toBe("200px");
        [
            element.find("div.viewer-diff img"),
            element.find("div.viewer-received img"),
            element.find("div.viewer-snapshot img"),
        ].forEach(img => {
            const imgInstance: HTMLImageElement = img.instance() as any;
            expect(imgInstance.style.width).toBe("200px");
            expect(imgInstance.style.height).toBe("200px");
            expect(imgInstance.width).toBe(200);
            expect(imgInstance.height).toBe(200);
        });
    });

    it("reacts to the sidebar being toggled", async () => {
        const element = mount(<DiffSlider {...someProps} />);
        HTMLDivElement.prototype.getBoundingClientRect = () => ({
            top: 10, left: 10, right: 10, bottom: 10, width: 200, height: 100,
        } as DOMRect);
        tsdi.get(StoreUi).toggleMenu();
        await new Promise(resolve => setTimeout(resolve, 1));
        expect((element.find("div.viewer-container").instance() as any).style.height).toBe("200px");
        [
            element.find("div.viewer-diff img"),
            element.find("div.viewer-received img"),
            element.find("div.viewer-snapshot img"),
        ].forEach(img => {
            const imgInstance: HTMLImageElement = img.instance() as any;
            expect(imgInstance.style.width).toBe("200px");
            expect(imgInstance.style.height).toBe("200px");
            expect(imgInstance.width).toBe(200);
            expect(imgInstance.height).toBe(200);
        });
    });
});
