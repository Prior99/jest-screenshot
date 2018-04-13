import * as React from "react";
import * as bulma from "bulma";
import * as css from "./navigation.scss";
import * as classNames from "classnames/bind";

const cx = classNames.bind({ ...bulma, ...css });

export class Navigation extends React.Component {
    public render() {
        return (
            <nav className={cx("navbar", "is-dark")}>
                <div className={cx("navbar-brand", "brand")}>
                    Jest Screenshot Report
                </div>
            </nav>
        );
    }
}
