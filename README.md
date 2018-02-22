# git-prefix-tag

get git tags with prefix

## Install

```sh
$ npm install git-prefix-tag --save-dev
```

## Usage

Assume you have tags like below

>4de0361ae9c51f51fb6d3a50addfff6ca2d64a99	refs/tags/dev-v0.0.1
>9ec697394a8def124f5b7c85e27a991adbff2c86	refs/tags/dev-v0.1.1
>3dbfd9dbce2f48c68051d025e037b54bc17b015a	refs/tags/dev-v0.1.2
>5409b3f8b96087d73973efdacc0a290b873612e3	refs/tags/dev-v0.1.3
>364a61ea754e8150e3bf460bc37709732260a851	refs/tags/prod-v0.1.0
>a0ebc1571e2c69725877191d688c815701a49e78	refs/tags/prod-v0.1.1
>a0ebc1571e2c69725877191d688c815701a49e78	refs/tags/sth-werid
>d5b47d82ecd19b5c19fe2bd28294ad887968a5aa	refs/tags/prod-v0.1.2
>10817d87a8182d2a72b174ffb70b879555a2b73c	refs/tags/prod-v0.1.3-alpha
>45a75e99ea1a6c333eadf81bdbfac164f6613955	refs/tags/prod-v0.1.4-beta
>702139d72160a729854e3adbc62a2955f87e212b	refs/tags/prod-v0.1.5
>984e86d46ef724d4d06026740624cce5ecdb59fd	refs/tags/prod-v0.1.6-beta

You can use `git-prefix-tag` to fetch the tag you want.

### getLatest

This function definition is below.

```typescript
function getLatest(prefix: string | regExp | Function, options: {
    semver: boolean = false,
    wholeVersion: boolean = false,
    withPrefix: boolean = false,
    all: boolean = false,
})： string | semver {}
```

You can use getLatest to get the latest version.

```javascript
const helper = require('git-prefix-tag');
console.log(helper.getLatest('dev-v')); // 0.1.3
```

#### Options

There are several options here.

**withPrefix**

You can add withPrefix option to get the whole tag

```javascript
const helper = require('git-prefix-tag');
console.log(helper.getLatest('dev-v', { withPrefix: true })); // dev-v0.1.3
```

**semver**

You can get a semver object.

```javascript
const helper = require('git-prefix-tag');
console.log(helper.getLatest('dev-v', { semver: true }));
/*
{
  "semver": {
    "raw": "0.1.3",
    "major": 0,
    "minor": 1,
    "patch": 3,
    "prerelease": [],
    "build": [],
    "version": "0.1.3"
  },
  "wholeVersion": "0.1.3",
  "prefix": "dev-v",
  "tag": "dev-v0.1.3",
  "version": "0.1.3"
}
*/
```

#### Input

you can custom your input

**RegExp**

```javascript
const helper = require('git-prefix-tag');
console.log(helper.getLatest(/dev-v/)); // 0.1.3
```

**Function**

```javascript
const helper = require('git-prefix-tag');
console.log(helper.getLatest(() => 'dev-v'))); // 0.1.3
```

### increase

You can get the increace tag based on the latest tag through this function. Its definition is like this.

```javascript
function increase(prefix: string | regExp | Function, type: 'major' | 'premajor' | 'minor' | 'preminor' | 'patch' | 'prepatch' | 'prerelease' = 'patch'): string {}
```

You can use like this.

```javascript
const helper = require('git-prefix-tag');
console.log(helper.increase('dev-v')); // '0.1.4'
console.log(helper.increase('dev-v', 'minor')); // '0.2.0'
```