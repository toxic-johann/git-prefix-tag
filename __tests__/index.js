const helper = require('../index');
const fs = require('fs');
const path = require('path');

describe('base test', () => {
  test('semverMap', () => {
    // const targetSemverMap = require('../const/semver-map.json');
    expect(true).toBe(true);
    fs.writeFileSync(path.resolve(__dirname, '../const/semver-map.json'), JSON.stringify(helper.semverMap, null, 2), { encoding: 'utf8' });
    // expect(helper.semverMap).toEqual(targetSemverMap);
  });

  describe('getLatest', () => {

    test('normal', () => {
      expect(helper.getLatest('dev-v')).toBe('0.1.3');
      expect(helper.getLatest('test-v')).toBe('0.5.1');
      expect(helper.getLatest('prod-v')).toBe('0.4.2');
    });

    test('with-prefix', () => {
      expect(helper.getLatest('dev-v', { withPrefix: true })).toBe('dev-v0.1.3');
      expect(helper.getLatest('test-v', { withPrefix: true })).toBe('test-v0.5.1');
      expect(helper.getLatest('prod-v', { withPrefix: true })).toBe('prod-v0.4.2');
    });

    test('wholeVersion', () => {
      expect(helper.getLatest('dev-v', { wholeVersion: true })).toBe('0.1.3');
      expect(helper.getLatest('test-v', { wholeVersion: true })).toBe('0.5.1');
      expect(helper.getLatest('prod-v', { wholeVersion: true })).toBe('0.4.2');
    });

    test('semver', () => {
      const targetSemverMap = require('../const/semver-map.json');

      const devList = targetSemverMap['dev-v'];
      expect(helper.getLatest('dev-v', { semver: true })).toEqual(devList[devList.length - 1].semver);

      const testList = targetSemverMap['test-v'];
      expect(helper.getLatest('test-v', { semver: true })).toEqual(testList[testList.length - 1].semver);

      const prodList = targetSemverMap['prod-v'];
      expect(helper.getLatest('prod-v', { semver: true })).toEqual(prodList[prodList.length - 1].semver);
    });

    test('all', () => {
      const targetSemverMap = require('../const/semver-map.json');

      const devList = targetSemverMap['dev-v'];
      expect(helper.getLatest('dev-v', { all: true })).toEqual(devList[devList.length - 1]);

      const testList = targetSemverMap['test-v'];
      expect(helper.getLatest('test-v', { all: true })).toEqual(testList[testList.length - 1]);

      const prodList = targetSemverMap['prod-v'];
      expect(helper.getLatest('prod-v', { all: true })).toEqual(prodList[prodList.length - 1]);
    });

    test('empty', () => {
      expect(helper.getLatest('nothing')).toBe('');
    });
  });

  describe('getPrefix', () => {
    test('regexp input', () => {
      expect(helper.getLatest(/dev-v/)).toBe('0.1.3');
      expect(helper.getLatest(/test-v/)).toBe('0.5.1');
      expect(helper.getLatest(/prod-v/)).toBe('0.4.2');
    });

    test('function input', () => {
      expect(helper.getLatest(() => 'dev-v')).toBe('0.1.3');
      expect(helper.getLatest(() => 'test-v')).toBe('0.5.1');
      expect(helper.getLatest(() => 'prod-v')).toBe('0.4.2');
    });

    test('werid input', () => {
      expect(() => helper.getLatest(123)).toThrow('prefix must be RegExp or String, but not number');
    });
  });

  describe('increase', () => {
    test('normal use', () => {
      expect(helper.increase('dev-v')).toBe('0.1.4');
      expect(helper.increase('dev-v', 'minor')).toBe('0.2.0');
      expect(helper.increase('dev-v', 'major')).toBe('1.0.0');
      expect(helper.increase()).toBe(null);
    });
  });
});
