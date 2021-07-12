import * as React from "react";
import bulma from "bulma";
import { observer } from "mobx-react";
import { external, inject } from "tsdi";
import { action } from "mobx";
import { StoreUi } from "../../store";
import css from "./navigation.scss";
import classNames from "classnames/bind";

const cx = classNames.bind({ ...bulma, ...css });

@external @observer
export class Navigation extends React.Component {
    @inject private ui: StoreUi;

    @action.bound private handleHamburgerClick() {
        this.ui.toggleMenu();
    }

    public render() {
        return (
            <nav className={cx("navbar", "is-dark")}>
                <div className={cx("navbar-brand", "brand")}>
                    Jest Screenshot Report
                </div>
                <div className={cx("navbar-menu", "is-active")}>
                    <div className={cx("navbar-end")}>
                        <a className={cx("navbar-item")} onClick={this.handleHamburgerClick}>
                            {this.ui.menuVisible ? "Hide Sidebar" : "Show Sidebar"}
                        </a>
                    </div>
                </div>
            </nav>
        );
    }
}
