import type { TestInfo } from "@playwright/test";

export function uniqueEmail(info:TestInfo, prefix = "customer"): string {
    return `${prefix}+w${info.workerIndex}-${Date.now()}@omnipizza.test`;
}

export function uniqueOrderId(info:TestInfo): string{
    const random = Math.floor(Math.random()*10_000);
    return `Ord-w${info.workerIndex}-${Date.now}-${random}`;
}

export function workerPrefix(info:TestInfo): string{
    return `w${info.workerIndex}`;
}