import { Dictionary } from '../types/common';

export class ObjectUtils {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static merge<T>(...objects: any[]): T {
        return objects.reduce((prev, obj) => {
            const result = { ...prev };

            Object.keys(obj)
                .forEach(key => {
                    const prevValue = prev[key];
                    const newValue = obj[key];

                    if (Array.isArray(prevValue) && Array.isArray(newValue)) {
                        result[key] = prevValue.concat(...newValue);
                    } else if (ObjectUtils.isObject(prevValue) && ObjectUtils.isObject(newValue)) {
                        result[key] = ObjectUtils.merge(prevValue as Dictionary, newValue as Dictionary);
                        // eslint-disable-next-line @eigenspace/script-rules/conditions
                    } else {
                        result[key] = newValue;
                    }
                });

            return result;
        }, {});
    }

    static isObject(obj: unknown): boolean {
        return obj && typeof obj === 'object';
    }
}