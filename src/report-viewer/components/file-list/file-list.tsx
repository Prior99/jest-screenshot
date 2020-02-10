import * as React from "react";
import * as bulma from "bulma";
import classNames from "classnames/bind";
import { FileListEntry } from "./file-list-entry";

const cx = classNames.bind(bulma);

export class FileList extends React.Component {
    public render() {
        return (
            <ul className={cx("menu-list")}>
                {testResults.files.map(file => <FileListEntry key={file.testFilePath} file={file} />)}
            </ul>
        );
    }
}
