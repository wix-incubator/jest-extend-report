const { generateTests } = require('../utils');

describe('Skipped suite', () => {
  test.skip.each(generateTests())('%i + %i should be %i', (a, b, c) => {
    expect(a + b).toBe(c);
  });
});
