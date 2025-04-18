/**
 * @type {object} RetryStatus
 * Retry-status object type.
 *
 * @param {number} RetryStatus.index
 * Retry overall duration, in milliseconds.
 *
 * @param {number} RetryStatus.duration
 * Retry overall duration, in milliseconds.
 *
 * @param {Error} [error]
 * Last error, if available;
 * It is undefined only when "retryAsync" calls "func" with index = 0.
 *
 * @param {any} [data]
 * Extra data for status handlers, if specified.
 */

/**
 * @function retryAsync
 * Retries async operation returned from `func` callback, according to `options`.
 *
 * @param {(s:RetryStatus) => Promise} func
 * Function that returns a Promise - result of the async operation to be retried.
 *
 * @param {object} [options]
 * Retry Options object.
 *
 * @param {number|((s:RetryStatus)=>number)} [options.retry]
 * Maximum number of retries (infinite by default),
 * or a callback to indicate the need for another retry.
 *
 * @param {number|((s:RetryStatus)=>number)} [options.delay]
 * Retry delays, in milliseconds (no delay by default),
 * or a callback that returns the delays.
 *
 * @param {(s:RetryStatus)=>void} [options.error]
 * Error notifications.
 *
 * @param {any} [options.data]
 * Extra data for status handlers.
 *
 * @returns {Promise}
 * Async result from the callback function.
 *
 * @example
 *
 * const {retryAsync} = require('./retry-async');
 *
 * // try making async request up to 3 times:
 * retryAsync(makeAsyncRequestFunc, {retry: 3})
 *     .then(console.log)
 *     .catch(console.error);
 */
function retryAsync(func, options) {
    const start = Date.now();
    let index = 0, e;
    let {retry = Number.POSITIVE_INFINITY, delay = -1, error, data} = options ?? {};
    const s = () => ({index, duration: Date.now() - start, error: e, data});
    const c = () => func(s()).catch(err => {
        e = err;
        typeof error === 'function' && error(s());
        if ((typeof retry === 'function' ? (retry(s()) ? 1 : 0) : retry--) <= 0) {
            return Promise.reject(e);
        }
        const d = typeof delay === 'function' ? delay(s()) : delay;
        index++;
        return d >= 0 ? (new Promise(a => setTimeout(a, d))).then(c) : c();
    });
    return c();
}

module.exports = {retryAsync};
