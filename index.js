const shell = require('shelljs');
const semver = require('semver');
const { isFunction, isRegExp, isString, isEmpty } = require('toxic-predicate-functions');

class Helper {
  getPrefix(rawPrefix) {
    const prefix = isFunction(rawPrefix)
      ? rawPrefix()
      : rawPrefix;
    if (!isRegExp(prefix) && !isString(prefix)) throw new Error(`prefix must be RegExp or String, but not ${typeof prefix}`);
    return prefix;
  }

  get semverMap() {
    const { stdout } = shell.exec('git ls-remote --tags origin', { silent: true });
    const rawTags = stdout.split(/\n/);
    const semverMap = rawTags.reduce((map, rawTag) => {
      if (!/refs\/tags\/(.*)$/.test(rawTag)) return map;

      const tag = rawTag.match(/refs\/tags\/(.*)$/)[1];

      const semverObj = semver.coerce(tag);

      if (!semverObj) return map;

      const [ prefix, suffix ] = tag.split(semverObj.raw);

      map[prefix] = map[prefix] || [];

      map[prefix].push({
        semver: semverObj,
        wholeVersion: semverObj.raw + suffix,
        prefix,
        tag,
        version: semverObj.raw,
      });

      return map;
    }, {});

    Object.values(semverMap).forEach(arr => arr.sort((a, b) => (semver.gt(a.semver, b.semver) ? 1 : -1)));

    return semverMap;
  }

  getLatest(rawPrefix, {
    semver = false,
    wholeVersion = false,
    withPrefix = false,
    all = false,
  } = {}) {
    const prefix = this.getPrefix(rawPrefix);

    let tagsList = [];

    const semverMap = this.semverMap;

    if (isString(prefix) && !isEmpty(semverMap[prefix])) {
      tagsList = semverMap[prefix];
    }

    if (isRegExp(prefix)) {
      for (const key in semverMap) {
        if (prefix.test(key)) {
          tagsList = semverMap[key];
          break;
        }
      }
    }

    const obj = tagsList[tagsList.length - 1] || {
      semver: {
        raw: '',
        major: 0,
        minor: 0,
        patch: 0,
        prerelease: [],
        build: [],
        version: '',
      },
      wholeVersion: '',
      prefix: '',
      tag: '',
      version: '',
    };

    if (semver) return obj.semver;
    else if (wholeVersion) return obj.wholeVersion;
    else if (withPrefix) return obj.tag;
    else if (all) return obj;

    return obj.version;
  }
}

module.exports = new Helper();
