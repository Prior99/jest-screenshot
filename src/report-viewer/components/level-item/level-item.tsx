import * as React from "react";
import bulma from "bulma";
import classNames from "classnames/bind";

const cx = classNames.bind(bulma);

export interface LevelItemProps {
    name: string;
    value: string;
}

export function LevelItem({ name, value }: LevelItemProps) {
    return (
        <div className={cx("level-item", "has-text-centered")}>
            <div>
                <p className={cx("heading")}>{name}</p>
                <p className={cx("title")}>{value}</p>
            </div>
        </div>
    );
}
