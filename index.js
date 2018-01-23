const shell = require('shelljs');
const semver = require('semver');
const { isFunction, isRegExp, isString } = require('toxic-predicate-functions');

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

      const version = semver.coerce(tag);

      if (!version) return map;

      const [ prefix, suffix ] = tag.split(version);

      map[prefix] = map[prefix] || [];

      map[prefix].push({
        version,
        wholeVersion: version + suffix,
        prefix,
        tag,
      });

      return map;
    }, {});

    Object.values(semverMap).forEach(arr => arr.sort((a, b) => (semver.gt(a.version, b.version) ? 1 : -1)));

    return semverMap;
  }

  getLatest(rawPrefix, {
    wholeVersion = false,
    withPrefix = false,
    all = false,
  }) {
    const prefix = this.getPrefix(rawPrefix);

    const tagsList = this.semverMap[prefix] || [];

    const obj = tagsList[tagsList.length - 1];

    if (wholeVersion) return obj.wholeVersion;
    else if (withPrefix) return obj.tag;
    else if (all) return obj;

    return obj.semver;
  }
}

module.exports = Helper;
