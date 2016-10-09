import fs from 'fs';
import path from 'path';
import Record from './record';

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
        lessThan80: new Record(),
        between80And90: new Record(),
        greaterThan90: new Record()
    };

    lines.forEach(line => {
        const adr = parseFloat(line[29]);
        const outcome = getOutcome(line[45]);
        let record;

        if (adr >= 90) {
            record = recordBasedonAdr.greaterThan90;
        } else if (adr < 90 && adr >= 80) {
            record = recordBasedonAdr.between80And90;
        } else {
            record = recordBasedonAdr.lessThan80;
        }

        record.update(outcome);
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
                recordBasedOnFriends[friend] = new Record();
            }

            recordBasedOnFriends[friend].update(outcome);
        });

        if (friends.length > 1) {
            const allFriendsInMatch = friends.join(',');

            if (!recordBasedOnFriends.hasOwnProperty(allFriendsInMatch)) {
                recordBasedOnFriends[allFriendsInMatch] = new Record();
            }

            recordBasedOnFriends[allFriendsInMatch].update(outcome);
        }
    });

    return recordBasedOnFriends;
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
    console.log('ADR < 80:', lessThan80.format());
    console.log('80 < ADR < 90:', between80And90.format());
    console.log('90 < ADR:', greaterThan90.format());
}

function printRecordBasedOnFriends(recordBasedOnFriends) {
    console.log('\nRecord based on friends');
    console.log('------------------------');

    Object.keys(recordBasedOnFriends).forEach(friends => {
        console.log(`${friends}: ${recordBasedOnFriends[friends].format()}`);
    });
}

readAndParseCsv('./csv/csgo_stats100816.csv').then(lines => {
    checkHeadings(lines.shift());
    printRecordBasedOnAdr(calculateRecordBasedOnAdr(lines));
    printRecordBasedOnFriends(calculateRecordBasedOnFriends(lines));
}).catch(err => console.log(err));
