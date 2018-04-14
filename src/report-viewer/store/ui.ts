import { component } from "tsdi";
import { observable, action, computed } from "mobx";
import { FileReport } from "../../reporter-types";

@component
export class StoreUi {
    @observable public menuVisible = true;

    @action.bound public toggleMenu() {
        this.menuVisible = !this.menuVisible;
    }
}
