// Helper: Safely get the value from an object by a dot-separated path.
export function getValueByPath(obj: any, pathStr: string) {
    if (pathStr === '') return obj; // Return the whole object if path is empty
    const path = pathStr.split('.');
    let current = obj;
    for (const key of path) {
        if (current == null || typeof current !== 'object') return undefined;
        current = current[key];
    }
    return current;
}

// Helper: Safely set the value into an object by a dot-separated path.
export function setValueByPath(obj: any, pathStr: string, value: string) {
    const path = pathStr.split('.');
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    const lastKey = path[path.length - 1];
    current[lastKey] = value;
}