import { component } from "tsdi";
import { observable, action, computed } from "mobx";
import { FileReport } from "../../reporter-types";
import { bind } from "lodash-decorators";

@component
export class StoreUi {
    @observable public menuVisible = true;

    @bind @action public toggleMenu() {
        this.menuVisible = !this.menuVisible;
    }
}
