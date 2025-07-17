import { getValueByPath, setValueByPath } from "./objectUtils";
import { expect } from "chai";

describe('getValueByPath', () => {
    const obj = {
        msg: {
            content: 'hello',
            metadata: { lang: 'en' },
        },
    };

    it('returns top-level field', () => {
        expect(getValueByPath(obj, 'msg.content')).to.equal('hello');
    });

    it('returns nested field', () => {
        expect(getValueByPath(obj, 'msg.metadata.lang')).to.equal('en');
    });

    it('returns undefined for non-existent path', () => {
        expect(getValueByPath(obj, 'msg.foo')).to.be.undefined;
    });

    it('returns object for empty path', () => {
        expect(getValueByPath(obj, '')).to.equal(obj);
    });
});