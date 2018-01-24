const helper = require('../index');

describe('base test', () => {
  test('semverMap', () => {
    const targetSemverMap = require('../const/semver-map.json');
    expect(helper.semverMap).toEqual(targetSemverMap);
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
  });
});
