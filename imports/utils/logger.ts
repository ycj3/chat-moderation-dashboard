// imports/utils/logger.ts
export function logDev(tag: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'production') return;

    const time = new Date().toISOString();
    console.log(`[${time}] [${tag}]`, ...args);
}
