import { component } from "tsdi";
import { observable, action, computed } from "mobx";
import { FileReport } from "../../reporter-types";

@component
export class StoreTestFiles {
    @observable public activeFileName = testResults.files.length > 0 ? testResults.files[0].testFilePath : undefined;

    @action.bound public selectFile(file: FileReport) {
        this.activeFileName = file.testFilePath;
    }

    @computed public get activeFile() {
        return testResults.files.find(file => file.testFilePath === this.activeFileName);
    }

    public isActive(file: FileReport) {
        return this.activeFileName === file.testFilePath;
    }
}
