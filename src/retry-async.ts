/**
 * Retry-status object type, for use with RetryCB.
 */
export type RetryStatus = {
    /**
     * retry index, starting from 0
     */
    index: number,
    /**
     * retry overall duration, in ms
     */
    duration: number,
    /**
     * last error, if available;
     * it is undefined only when "retryAsync" calls "func" with index = 0.
     */
    error?: any
};

/**
 * Retry-status callback type.
 */
export type RetryCB<T> = (s: RetryStatus) => T;

/**
 * Type for options passed into retryAsync function.
 */
export type RetryOptions = {
    /**
     * maximum number of retries (infinite by default),
     * or a callback to indicate the need for another retry
     */
    retry?: number | RetryCB<boolean>,
    /**
     * retry delays, in ms, or a callback that returns them
     */
    delay?: number | RetryCB<number>,
    /**
     * error notifications
     */
    error?: RetryCB<void>
};

/**
 * Retries async operation returned from "func" callback, according to options.
 */
export function retryAsync<T>(func: RetryCB<Promise<T>>, options?: RetryOptions): Promise<T> {
    const start = Date.now();
    let index = 0, e: any;
    let {retry = Number.POSITIVE_INFINITY, delay = -1, error} = options ?? {};
    const s = () => ({index, duration: Date.now() - start, error: e});
    const c: () => Promise<T> = () => func(s()).catch(err => {
        e = err;
        typeof error === 'function' && error(s());
        const r = typeof retry === 'function' ? (retry(s()) ? 1 : 0) : retry--;
        const d = typeof delay === 'function' ? delay(s()) : delay;
        index++;
        const t = () => r > 0 ? c() : Promise.reject(e);
        return d >= 0 ? (new Promise(a => setTimeout(a, d))).then(t) : t();
    });
    return c();
}
