// Recursively get the value of a field (not by path)
export function getValueByField(obj: any, field: string, seen = new Set()): any {
    if (!field || typeof obj !== 'object' || obj === null) return undefined;
    if (seen.has(obj)) return undefined; // prevent infinite recursion
    seen.add(obj);

    if (field in obj) return obj[field];

    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (typeof val === 'object' && val !== null) {
            const result = getValueByField(val, field, seen);
            if (result !== undefined) return result;
        }
    }

    return undefined;
}

// Recursively set the value of a field (not by path)
export function setValueByField(obj: any, field: string, value: any, seen = new Set()): boolean {
    if (!field || typeof obj !== 'object' || obj === null) return false;
    if (seen.has(obj)) return false; // prevent infinite recursion
    seen.add(obj);

    if (field in obj) {
        obj[field] = value;
        return true;
    }

    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (typeof val === 'object' && val !== null) {
            const updated = setValueByField(val, field, value, seen);
            if (updated) return true;
        }
    }

    return false;
}