import * as React from "react";
import bulma from "bulma";
import classNames from "classnames/bind";
import { inject, external } from "tsdi";
import { observer } from "mobx-react";
import { computed, action } from "mobx";
import { StoreTestFiles } from "../../../store";
import { FileReport } from "../../../../reporter-types";

const cx = classNames.bind(bulma);

export interface FileListEntryProps {
    file: FileReport;
}

@observer @external
export class FileListEntry extends React.Component<FileListEntryProps> {
    @inject private testFiles: StoreTestFiles;

    @computed private get file() { return this.props.file; }
    @computed private get active() { return this.testFiles.isActive(this.file); }

    @action.bound public handleClick() {
        this.testFiles.selectFile(this.file);
    }

    public render() {
        return (
            <li>
                <a
                    className={cx({ "is-active": this.active })}
                    onClick={this.handleClick}
                >
                    {this.file.testFilePath}
                </a>
            </li>
        );
    }
}
