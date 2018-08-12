## Developing

_Read the [Webpack docs](https://webpack.github.io/docs) and the [Chrome Extension](https://developer.chrome.com/extensions/getstarted) docs._

1. Check if your Node.js version is >= 8.6
2. Clone the repository.
3. Install [yarn](https://yarnpkg.com/lang/en/docs/install/).
4. Run `yarn`.
5. Run `yarn start`
6. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
7. Have fun.

## Structure

All of the extension's development code must be placed in `src` folder, including the extension manifest.

## Changing the port

You can run the webpack dev server on another port if you want. Just specify the env var `port` like this:

```
$ PORT=6002 yarn start
```

## Guidelines

1. **Please!! Do not create a pull request without an issue discussing the problem.**
2. On your PR make sure that you are following the current codebase style.
3. Your PR must be single purpose. Resolve just one problem on your PR.
