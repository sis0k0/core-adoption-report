const { Linter, ESLint } = require("eslint");
const { rules } = require("@clr/eslint-plugin-clarity-adoption");
const { parseForESLint } = require("@clr/eslint-plugin-clarity-adoption/html-parser");

function verifyFileContent(fileContent, fileName) {
    const linter = new Linter();

    for (const rule of Object.keys(rules)) {
        linter.defineRule(rule, rules[rule]);
    }
    const definedRules = Object.keys(rules).reduce((obj, rule) => {
        obj[rule] = 'error';
        return obj;
    }, {});
    linter.defineParser('@clr/eslint-plugin-clarity-adoption/html-parser', { parseForESLint });

    const messages = linter.verify(fileContent, {
        parser: '@clr/eslint-plugin-clarity-adoption/html-parser',
        rules: definedRules,
    }, fileName)

    messages.forEach(m => m.fileName = fileName);


    return messages;
}

module.exports = {
    verifyFileContent
};