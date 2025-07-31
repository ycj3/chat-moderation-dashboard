// imports/utils/logger.ts
import util from "util";

export function logDev(tag: string, ...args: any[]) {
  if (process.env.NODE_ENV === "production") return;

  const time = new Date().toISOString();
  const formatted = args.map((arg) => {
    return typeof arg === "object"
      ? util.inspect(arg, { depth: null, colors: true })
      : arg;
  });

  console.log(`[${time}] [${tag}]`, ...formatted);
}
