import { ReportMetadata } from "../reporter-types";

declare global {
    const testResults: ReportMetadata;
}
