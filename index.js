#!/usr/bin/env node

const ejs = require('ejs');
const { writeFile } = require('fs').promises;
const { resolve } = require('path');

const { verifyFileContent } = require('./src/eslint');
const { getFilesList, readFiles } = require('./src/fs-helper');

(async () => {
    const directory = process.argv[2] || '.';
    const files = await getFilesList(directory, '.html');
    const fileContents = await readFiles(files);

    const linterMessages = fileContents
        .map((current) => verifyFileContent(current.content, current.name))
        .flat();
    
    const linterMessagesGroupedByComponent = linterMessages.reduce((all, current) => {
        const { component } = current;
        all[component] = all[component] || [];
        all[component].push(current);

        return all;
    }, {});

    ejs.renderFile(
        resolve(__dirname, 'src/template.html.ejs'),
        { messages: linterMessagesGroupedByComponent },
        { filename: 'report' },
        async function(error, content) {
            if (error) {
                throw error;
            }

            const filePath = 'report.html';
            await writeFile(filePath, content);
            console.info(`Report generated at ${filePath}`);
        }
    );
})();