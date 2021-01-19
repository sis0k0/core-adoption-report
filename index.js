#!/usr/bin/env node

const { verifyFileContent } = require('./src/eslint');
const { getFilesList, readFiles } = require('./src/fs-helper');

(async () => {
    const directory = process.argv[2] || '.';
    const files = await getFilesList(directory, '.html');
    const fileContents = await readFiles(files);

    const linterMessages = fileContents
        .map((current) => verifyFileContent(current.content, current.name))
        .flat();
    
    const linterMessagesGroupedByRule = linterMessages.reduce((all, current) => {
        const { ruleId } = current;
        all[ruleId] = all[ruleId] || [];
        all[ruleId].push(current);

        return all;
    }, {});

    console.log(linterMessagesGroupedByRule);

})();