import { resolve } from 'path';
import { promises as fs } from 'fs';
const { readFile } = fs;

import { generateReport } from '../src/reporter';

describe('Generate report', () => {
    it('should create a report file with found components and their locations', async () => {
        await generateReport(resolve(__dirname, 'files'));
        
        let actualReport;
        let expectedReport;
        try {
            actualReport = await readFile(resolve(process.cwd(), 'report.html'));
            expectedReport = await readFile(resolve(__dirname, 'expectedReports/full-report.html'));
        } catch(error) {
            console.error(error);
            fail('Report file should have been generated');
        }

        expect(actualReport).toBeDefined();
        expect(actualReport.equals(expectedReport)).toBe(true);
    });

    it('should create a report file with appropriate text if no Clarity Angular components were found', async () => {
        await generateReport(resolve(__dirname, 'files/empty-directory'));
        
        let actualReport;
        let expectedReport;
        try {
            actualReport = await readFile(resolve(process.cwd(), 'report.html'));
            expectedReport = await readFile(resolve(__dirname, 'expectedReports/empty-report.html'));
        } catch(error) {
            console.error(error);
            fail('Report file should have been generated');
        }

        expect(actualReport).toBeDefined();
        expect(actualReport.equals(expectedReport)).toBe(true);
    });
});
