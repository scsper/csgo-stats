import fs from 'fs';
import path from 'path';

const HEADINGS = {
    5: 'Map',
    21: 'Kills',
    22: 'Assists',
    23: '5K',
    24: '4K',
    25: '3K',
    26: '2K',
    27: '1K',
    29: 'Average Damage Per Round',
    45: 'Comment'
};

const WIN = 'win';
const LOSS = 'loss';

function checkHeadings(headingsFromCsv) {
    const headingsMapFromCsv = headingsFromCsv.reduce((map, heading, index) => {
        map[index] = heading;

        // console.log(`${index}: ${heading}`);

        return map;
    }, {});

    // exits early if any heading does not match
    const invalid = Object.keys(HEADINGS).some(key => {
        if (HEADINGS[key] !== headingsMapFromCsv[key]) {
            console.log('heading does not match for key:', key);
            return true;
        }

        return false;
    });

    return !invalid;
}

function readAndParseCsv(csvPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(csvPath), 'utf8', (err, data) => {
            if (err) reject(err);

            const lines = data.split('\n');
            const parsedLines = lines.map(line => line.split(','));

            resolve(parsedLines);
        });
    });
}

function calculateRecordBasedOnAdr(lines) {
    const recordBasedonAdr = {
        lessThan80: [0, 0, 0],
        between80And90: [0, 0, 0],
        greaterThan90: [0, 0, 0]
    };

    lines.forEach(line => {
        const adr = parseFloat(line[29]);
        const outcome = line[45];
        let recordToModify;

        if (adr >= 90) {
            recordToModify = recordBasedonAdr.greaterThan90;
        } else if (adr < 90 && adr >= 80) {
            recordToModify = recordBasedonAdr.between80And90;
        } else {
            recordToModify = recordBasedonAdr.lessThan80;
        }

        if (outcome === WIN) {
            recordToModify[0]++;
        } else if (outcome === LOSS) {
            recordToModify[1]++;
        } else {
            recordToModify[2]++;
        }
    });

    return recordBasedonAdr;
}

function printRecordBasedOnAdr(recordBasedonAdr) {
    const {lessThan80, between80And90, greaterThan90} = recordBasedonAdr;

    console.log('ADR < 80:', formatRecord(lessThan80));
    console.log('80 < ADR < 90:', formatRecord(between80And90));
    console.log('90 < ADR:', formatRecord(greaterThan90));
}

function formatRecord(record) {
    return `${record[0]}-${record[1]}-${record[2]}`;
}

readAndParseCsv('./csv/csgo_stats100616.csv').then(lines => {
    checkHeadings(lines.shift());
    printRecordBasedOnAdr(calculateRecordBasedOnAdr(lines));
}).catch(err => console.log(err));
