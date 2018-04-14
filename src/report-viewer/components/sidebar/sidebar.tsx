import * as React from "react";
import * as bulma from "bulma";
import * as classNames from "classnames/bind";
import * as css from "./sidebar.scss";
import { observer } from "mobx-react";
import { external, inject } from "tsdi";
import { FileList } from "../file-list";
import { StoreUi } from "../../store";

const cx = classNames.bind({ ...bulma, ...css });

@external @observer
export class Sidebar extends React.Component {
    @inject private ui: StoreUi;

    public render() {
        const classes = cx({
            "column": true,
            "is-3": this.ui.menuVisible,
            "section": true,
            "is-fullheight": true,
            "menu": true,
            "sidebar": true,
        });
        return (
            <aside className={classes}>
                <p className={cx("menu-label")} />
                <FileList />
            </aside>
        );
    }
}
