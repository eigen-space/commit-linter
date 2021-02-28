import { ObjectUtils } from './object.utils';

describe('ObjectUtils', () => {

    describe('#merge', () => {

        it('should return merged objects', () => {
            const objectA = { a: 1 };
            const objectB = { b: 2 };

            const result = ObjectUtils.merge(objectA, objectB);

            expect(result).toEqual({ ...objectA, ...objectB });
        });

        it('should return merged objects with merged nested objects', () => {
            const objectA = {
                a: { nestedA: 1 }
            };
            const objectB = {
                a: { nestedB: 2 }
            };

            const actual = ObjectUtils.merge(objectA, objectB);
            const expected = {
                a: { nestedA: 1, nestedB: 2 }
            };

            expect(actual).toEqual(expected);
        });

        it('should return merged objects with merged nested arrays', () => {
            const objectA = {
                a: [1, 2]
            };
            const objectB = {
                a: [3, 4]
            };

            const actual = ObjectUtils.merge(objectA, objectB);

            const expected = {
                a: [1, 2, 3, 4]
            };
            expect(actual).toEqual(expected);
        });
    });
});
