import ejs from 'ejs';
import { promises as fs } from 'fs';
import { resolve } from 'path';
const { writeFile } = fs;

import { ExtendedMessage, verifyFileContent } from './eslint';
import { getFilesList, readFiles } from './fs-helper';

export async function generateReport(directory: string = '.') {
    const files = await getFilesList(directory, '.html');
    const fileContents = await readFiles(files);

    const linterMessagesByFile = fileContents
        .map((current) => verifyFileContent(current.content, current.name));
    const linterMessages = ([] as Array<ExtendedMessage>).concat(...linterMessagesByFile);
    
    const linterMessagesGroupedByComponent = linterMessages.reduce((all, current) => {
        const { component } = current;
        if (component) {
            all[component] = all[component] || [];
            all[component].push(current);
        }

        return all;
    }, {});

    ejs.renderFile(
        resolve(__dirname, 'template.html.ejs'),
        { messages: linterMessagesGroupedByComponent },
        { filename: 'report' },
        async function(error: Error, content: string) {
            if (error) {
                throw error;
            }

            const filePath = 'report.html';
            await writeFile(filePath, content);
            console.info(`Report generated at ${filePath}`);
        }
    );
}