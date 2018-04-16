import { StoreUi } from "..";

describe("StoreUi", () => {
    let ui: StoreUi;

    beforeEach(() => {
        ui = new StoreUi();
    });

    it("toggles the menu visibility", () => {
        expect(ui.menuVisible).toBe(true);
        ui.toggleMenu();
        expect(ui.menuVisible).toBe(false);
        ui.toggleMenu();
        expect(ui.menuVisible).toBe(true);
    });
});
