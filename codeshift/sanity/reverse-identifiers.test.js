jest.autoMockOff();
const defineTest = require("jscodeshift/dist/testUtils").defineTest;
const defineInlineTest = require("jscodeshift/dist/testUtils").defineInlineTest;
const transform = require('./reverse-identifiers');

describe('reverse-identifiers', () => {
  defineInlineTest(transform, {}, `
var firstWord = 'Hello ';
var secondWord = 'world';
var message = firstWord + secondWord;`,`
var droWtsrif = 'Hello ';
var droWdnoces = 'world';
var egassem = droWtsrif + droWdnoces;
  `);
});
