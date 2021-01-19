const { resolve } = require('path');
const { readdir, readFile } = require('fs').promises;

async function readFiles(files) {
    const promises = files.map(file => readFile(file, { encoding: 'utf-8' }))
    const contents = await Promise.all(promises);
    const nameContentMap = contents.map((content, index) => ({
        name: files[index],
        content: content
    }));

    return nameContentMap;
}

async function getFilesList(directory, ext = '') {
    const files = [];

    const filesIterator = getFilesGenerator(directory);
    for await (const file of filesIterator) {
        if (file.endsWith(ext)) {
            files.push(file);
        }
    }

    return files;
}

async function* getFilesGenerator(directory) {
    const directoryEntries = await readdir(directory, { withFileTypes: true });

    for (const entry of directoryEntries) {
        const file = resolve(directory, entry.name);
        if (entry.isDirectory()) {
            yield* getFilesGenerator(file);
        } else {
            yield file;
        }
    }
}

module.exports = {
    getFilesList,
    readFiles
}