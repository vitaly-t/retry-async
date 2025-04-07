# retry-async

Optimized retry-async in TypeScript / JavaScript, for copy-n-paste (no library) ☝️

Just copy either [retry-async.ts](./src/retry-async.ts) or [retry-async.js](./src/retry-async.js) file into your project, and you're good to go 🚀

Function `retryAsync` there is documented and self-explanatory, and that is all you need 😉

```js
retryAsync(retrier : Function, options : Object) => Promise
```

That function is very straightforward to use, but check out [the original gist](https://gist.github.com/vitaly-t/6e3d285854d882b1618c7e435df164c4) 📝, 
for some interesting practical examples 😉

---

To run [./src/test.ts](./src/test.ts), install dependencies via `npm i`, and then run `npm test`.
