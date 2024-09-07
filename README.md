# retry-async

Optimized retry-async in TypeScript, for copy-n-paste (no library). See [the original gist](https://gist.github.com/vitaly-t/6e3d285854d882b1618c7e435df164c4) 📝

Just copy [retry-async.ts](./src/retry-async.ts) (or [retry-async.js](./src/retry-async.js)) file into your project, and you're good to go 🚀

Function `retryAsync` there is self-explanatory, and that is all you need 😉

```js
retryAsync(retrier : Function, options : Object) => Promise
```

To run [./src/test.ts](./src/test.ts), install dependencies via `npm i`, and then do `npm test`.
