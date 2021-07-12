import * as React from "react";
import * as ReactDOM from "react-dom";
import bulma from "bulma";
import classNames from "classnames/bind";
import { TSDI } from "tsdi";
import { Navigation, Sidebar, Main } from "./components";

const tsdi = new TSDI();
tsdi.enableComponentScanner();

const cx = classNames.bind(bulma);

ReactDOM.render(
    <>
        <Navigation />
        <div className={cx("columns")}>
            <Sidebar />
            <Main />
        </div>
    </>,
    document.getElementById("root"),
);
