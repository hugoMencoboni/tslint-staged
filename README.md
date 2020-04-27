# tslint-staged

Run tsLint against **staged git files only** !

Used as git hook, it will run fast by not running on all of your project files !

## Important note !!!

TsLint will be **depreciated** in a near future to move to **esLint** !

**[Lint-staged](https://github.com/okonet/lint-staged)** will gives you the same feature and more for esLint or if you already use **Prettier**.

## Install & configuration
```sh
npm install --save-dev tslint-staged
```

`tslint-staged` configuration holds directly in your `package.json` :
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

`include` and `exclude` leave you filter analysed files. `tslint-staged` uses [micromatch](https://github.com/micromatch/micromatch) for matching files. You can use wild cards as `*`, `**` and more !

## Use it as a hook with [Husky](https://github.com/typicode/husky)

The most usefull way to use `tslint-staged` is linked as a pre-commit/pre-push hook !

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
