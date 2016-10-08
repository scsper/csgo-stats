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
        const outcome = getOutcome(line[45]);
        let recordToModify;

        if (adr >= 90) {
            recordToModify = recordBasedonAdr.greaterThan90;
        } else if (adr < 90 && adr >= 80) {
            recordToModify = recordBasedonAdr.between80And90;
        } else {
            recordToModify = recordBasedonAdr.lessThan80;
        }

        updateRecord(recordToModify, outcome);
    });

    return recordBasedonAdr;
}

function calculateRecordBasedOnFriends(lines) {
    const recordBasedOnFriends = {};

    lines.forEach(line => {
        const outcome = getOutcome(line[45]);
        const friends = getFriends(line[45]);

        friends.forEach(friend => {
            if (!recordBasedOnFriends.hasOwnProperty(friend)) {
                recordBasedOnFriends[friend] = [0, 0, 0];
            }

            updateRecord(recordBasedOnFriends[friend], outcome);
        });

        if (friends.length > 1) {
            const allFriendsInMatch = friends.join(',');

            if (!recordBasedOnFriends.hasOwnProperty(allFriendsInMatch)) {
                recordBasedOnFriends[allFriendsInMatch] = [0, 0, 0];
            }

            updateRecord(recordBasedOnFriends[allFriendsInMatch], outcome);
        }
    });

    return recordBasedOnFriends;
}

/**
 * Note: this function modifies the reference of record
 */
function updateRecord(record, outcome) {
    if (outcome === WIN) {
        record[0]++;
    } else if (outcome === LOSS) {
        record[1]++;
    } else {
        record[2]++;
    }
}

function getOutcome(comment) {
    return comment.split('|')[0].trim();
}

function getFriends(comment) {
    let friends = comment.split('|');

    if (friends.length <= 1) {
        return [];
    }

    friends = friends[1];

    return friends.split(':').map(friend => friend.trim());
}

function printRecordBasedOnAdr(recordBasedonAdr) {
    const {lessThan80, between80And90, greaterThan90} = recordBasedonAdr;

    console.log('\nRecord based on ADR');
    console.log('------------------------');
    console.log('ADR < 80:', formatRecord(lessThan80));
    console.log('80 < ADR < 90:', formatRecord(between80And90));
    console.log('90 < ADR:', formatRecord(greaterThan90));
}

function printRecordBasedOnFriends(recordBasedOnFriends) {
    console.log('\nRecord based on friends');
    console.log('------------------------');

    Object.keys(recordBasedOnFriends).forEach(friends => {
        console.log(`${friends}: ${formatRecord(recordBasedOnFriends[friends])}`);
    });
}

function formatRecord(record) {
    return `${record[0]}-${record[1]}-${record[2]}`;
}

readAndParseCsv('./csv/csgo_stats100816.csv').then(lines => {
    checkHeadings(lines.shift());
    printRecordBasedOnAdr(calculateRecordBasedOnAdr(lines));
    printRecordBasedOnFriends(calculateRecordBasedOnFriends(lines));
}).catch(err => console.log(err));
