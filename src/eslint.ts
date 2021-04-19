import { Linter } from "eslint";
import { relative } from 'path';
import { parseForESLint } from "@clr/eslint-plugin-clarity-adoption/html-parser";

export interface ExtendedMessage extends Linter.LintMessage {
    fileName?: string,
    component?: string,
};

// We have to import with require because the plugin exports with module.exports
const { rules } = require("@clr/eslint-plugin-clarity-adoption");

const PARSER = '@clr/eslint-plugin-clarity-adoption/html-parser';

export function verifyFileContent(fileContent: string, fileName: string): Array<ExtendedMessage> {
    const linter = new Linter();

    for (const rule of Object.keys(rules)) {
        linter.defineRule(rule, rules[rule]);
    }
    const definedRules = Object.keys(rules).reduce((obj, rule) => {
        obj[rule] = 'error';
        return obj;
    }, {});
    linter.defineParser(PARSER, { parseForESLint });

    const messages: Array<ExtendedMessage> = linter.verify(fileContent, {
        parser: PARSER,
        rules: definedRules,
    });
    
    messages.forEach(m => {
        m.fileName = relative(process.cwd(), fileName);
        m.component = m?.ruleId?.split('-').pop();
    });

    return messages;
}
