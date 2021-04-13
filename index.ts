#!/usr/bin/env node

import { generateReport } from "./src/reporter";

(async () => {
    const directory = process.argv[2];

    try {
        await generateReport(directory);
    } catch(e) {
        console.error(e);
        throw e;
    }
})();
