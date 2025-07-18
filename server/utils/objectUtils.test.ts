import { getValueByField, setValueByField } from "./objectUtils";
import { expect } from "chai";

describe('getValueByField & setValueByField', () => {
    const sample = {
        user: { id: 'u1', name: 'Carlson' },
        message: {
            content: 'hi',
            metadata: {
                customField: 'value',
            },
        },
    };

    it('should get a top-level nested field by name', () => {
        const value = getValueByField(sample, 'name');
        expect(value).to.equal('Carlson');
    });

    it('should get a deep nested field by name', () => {
        const value = getValueByField(sample, 'customField');
        expect(value).to.equal('value');
    });

    it('should return undefined if field does not exist', () => {
        const value = getValueByField(sample, 'notExist');
        expect(value).to.be.undefined;
    });

    it('should set a top-level nested field by name', () => {
        const copy = JSON.parse(JSON.stringify(sample));
        const success = setValueByField(copy, 'name', 'Ellie');
        expect(success).to.be.true;
        expect(copy.user.name).to.equal('Ellie');
    });

    it('should set a deep nested field by name', () => {
        const copy = JSON.parse(JSON.stringify(sample));
        const success = setValueByField(copy, 'customField', 'updated');
        expect(success).to.be.true;
        expect(copy.message.metadata.customField).to.equal('updated');
    });

    it('should return false if field does not exist when setting', () => {
        const copy = JSON.parse(JSON.stringify(sample));
        const success = setValueByField(copy, 'unknownField', 'something');
        expect(success).to.be.false;
    });
});