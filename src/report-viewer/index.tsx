import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.scss";
import * as bulma from "bulma";
import * as classNames from "classnames";

const cx = classNames.bind(bulma);

ReactDOM.render(
    <div className={cx("container", "is-fullhd")}>
        Hello, World!
    </div>,
    document.getElementById("root"),
);
