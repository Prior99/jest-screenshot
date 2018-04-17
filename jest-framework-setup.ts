(global as any).requestAnimationFrame = (callback: Function) => setTimeout(callback, 0);

import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { TSDI } from "tsdi";

let tsdi: TSDI;

Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
    tsdi = new TSDI();
    tsdi.enableComponentScanner();
});

afterEach(() => {
    tsdi.close();
});
