/**
 * Retries async operation returned from "func" callback, according to options.
 */
function retryAsync(func, options) {
    const start = Date.now();
    let index = 0, e;
    let { retry = Number.POSITIVE_INFINITY, delay = -1, error } = options ?? {};
    const s = () => ({ index, duration: Date.now() - start, error: e });
    const c = () => func(s()).catch(err => {
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
