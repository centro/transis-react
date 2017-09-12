jest.autoMockOff();
const remove_console = require("./remove_console");
const defineInlineTest = require("jscodeshift/dist/testUtils").defineInlineTest;

describe("remove_console", () => {
  defineInlineTest(
    remove_console,
    {},
    `
      export const sum = (a, b) => {
        console.log("calling sum with", arguments);
        return a + b;
      }
    `,
    `
      export const sum = (a, b) => {
        return a + b;
      }
    `
  );
});
