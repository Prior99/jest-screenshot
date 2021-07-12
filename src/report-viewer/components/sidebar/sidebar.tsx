import * as React from "react";
import bulma from "bulma";
import classNames from "classnames/bind";
import css from "./sidebar.scss";
import { observer } from "mobx-react";
import { external, inject } from "tsdi";
import { FileList } from "../file-list";
import { StoreUi } from "../../store";

const cx = classNames.bind({ ...bulma, ...css });

@external @observer
export class Sidebar extends React.Component {
    @inject private ui: StoreUi;

    public render() {
        if (!this.ui.menuVisible) { return null; }
        const classes = cx(
            "column",
            "is-3",
            "section",
            "is-fullheight",
            "menu",
        );
        return (
            <aside className={classes}>
                <p className={cx("menu-label")} />
                <FileList />
            </aside>
        );
    }
}
