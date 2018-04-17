import { StoreUi } from "..";

describe("StoreUi", () => {
    it("toggles the menu visibility", () => {
        const ui = tsdi.get(StoreUi);
        expect(ui.menuVisible).toBe(true);
        ui.toggleMenu();
        expect(ui.menuVisible).toBe(false);
        ui.toggleMenu();
        expect(ui.menuVisible).toBe(true);
    });
});
