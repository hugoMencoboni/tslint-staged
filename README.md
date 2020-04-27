# TSLint-Staged

Run **[TSLint](https://github.com/palantir/tslint)** against **staged git files only** !

Used as git hook, it will run fast by not running on all of your project files !

## Important note !!!

TSLint will be **depreciated** in a near future to move to **ESLint** !

**[Lint-staged](https://github.com/okonet/lint-staged)** gives you the same feature and more for ESLint and **[Prettier](https://github.com/prettier/prettier)**.

## Install & configuration
```sh
npm install --save-dev tslint-staged
```

TSLint-Staged configuration holds directly in your `package.json` :
```js
{
  ...,
  "tslintStaged": {
    "tslintConfig": "tslint.json",
    "include": [ "**/*.ts" ],
    "exclude": []
  },
  ...
}
```
`tslint_config` specify the path of your own `tslint.json` configuration file.

`include` and `exclude` allow you to filter analysed files. TSLint-Staged uses [micromatch](https://github.com/micromatch/micromatch) for matching files. You can use wild cards as `*`, `**` and more !

You can now run TSLint-Staged :
```bash
npm run tslint-staged
```

## Use it as a hook with [Husky](https://github.com/typicode/husky)

The most usefull way to use TSLint-staged is to use it as a pre-commit/pre-push hook !

```js
{
  ...,
  "husky": {
    "hooks": {
      "pre-commit": "tslint-staged"
    }
  },
  ...
}
```
