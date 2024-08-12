// retry-status object:
//  - "index": retry index, starting from 0
//  - "duration": retry overall duration, in ms
//  - "error": last error, if available
export type RetryStatus = { index: number, duration: number, error?: any };

// retry-status callback;
export type RetryCB<T> = (s: RetryStatus) => T;

export type RetryOptions = {
    // maximum number of retries (infinite by default),
    // or a callback to indicate the need for another retry;
    retry?: number | RetryCB<boolean>,

    // retry delays, in ms, or a callback that returns them;
    delay?: number | RetryCB<number>,

    // error notifications;
    error?: RetryCB<void>
};

// retries async operation returned from "func" callback, according to options;
// note that "func()" will receive "error" = undefined when "index" = 0.
export function retryAsync<T>(func: RetryCB<Promise<T>>, options?: RetryOptions) {
    const start = Date.now();
    let index = 0, e: any;
    let {retry = Number.POSITIVE_INFINITY, delay = -1, error} = options ?? {};
    const s = () => ({index, duration: Date.now() - start, error: e});
    const c: () => Promise<T> = () => func(s()).catch(err => {
        e = err;
        typeof error === 'function' && error(s());
        const r = typeof retry === 'function' ? retry(s()) : retry--;
        const d = typeof delay === 'function' ? delay(s()) : delay;
        index++;
        const p = () => r ? c() : Promise.reject(e);
        return d >= 0 ? (new Promise(a => setTimeout(a, d))).then(p) : p();
    });
    return c();
}
