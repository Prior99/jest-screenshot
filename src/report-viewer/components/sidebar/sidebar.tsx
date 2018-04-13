import * as React from "react";
import * as bulma from "bulma";
import * as classNames from "classnames/bind";
import { FileList } from "../file-list";

const cx = classNames.bind(bulma);

export class Sidebar extends React.Component {
    public render() {
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
