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
     * last error, if available
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
 *
 * Note that "func()" will receive "error" = undefined when "index" = 0.
 */
export function retryAsync<T>(func: RetryCB<Promise<T>>, options?: RetryOptions) {
    const start = Date.now();
    let index = 0, e: any;
    let {retry = Number.POSITIVE_INFINITY, delay = -1, error} = options ?? {};
    const s = () => ({index, duration: Date.now() - start, error: e}); // status creator
    const c: () => Promise<T> = () => func(s()).catch(err => {
        e = err;
        typeof error === 'function' && error(s()); // error notification
        const r = typeof retry === 'function' ? retry(s()) : retry--; // get retry flag
        const d = typeof delay === 'function' ? delay(s()) : delay; // get delay value
        index++;
        const t = () => r ? c() : Promise.reject(e); // retry vs reject test
        return d >= 0 ? (new Promise(a => setTimeout(a, d))).then(t) : t();
    });
    return c();
}
