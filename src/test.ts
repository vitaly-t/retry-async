import {retryAsync, RetryStatus} from './retry-async';

let failCount = 4; // let's fail our requests 4 times

// our async function, result from which we intend to re-try, when it fails:
async function makeRequest(s: RetryStatus) {
    if (--failCount >= 0) {
        throw new Error(`Request failed ${s.index + 1} time(s)`);
    }
    return `Request succeeded after ${s.duration}ms and ${s.index + 1} attempt(s)`;
}

// use delays with 0.5s increments:
const delay = (s: RetryStatus) => (s.index + 1) * 500;

// retry for up to 5 times, with duration not exceeding 4s:
const retry = (s: RetryStatus) => s.index < 5 && s.duration <= 4000;

const error = (s: RetryStatus) => {
    const info = {index: s.index, duration: s.duration, error: s.error.message};
    console.error('Handling:', info);
}

(function test() {
    retryAsync(makeRequest, {retry, delay, error})
        .then(data => console.log('SUCCESS:', data))
        .catch(err => console.error('FAILED:', err));
})();
