import { expect, describe, test } from '@jest/globals';

describe('Basic Application Tests', () => {

    test('string operations', () => {
        expect('hello').toHaveLength(5);
    });

    test('numeric operations', () => {
        expect(1 + 1).toBe(2);
    });

    test('array operations', () => {
        const arr = [1, 2, 3];
        expect(arr).toHaveLength(3);
        expect(arr).toContain(2);
    });

});

