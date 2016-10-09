import fs from 'fs';
import path from 'path';
import Record from './record';
import Game from './game';

const HEADINGS = {
    1: 'ID',
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

function calculateRecordBasedOnAdr(games) {
    const recordBasedonAdr = {
        lessThan80: new Record(),
        between80And90: new Record(),
        greaterThan90: new Record()
    };

    games.forEach(game => {
        const adr = game.adr;
        let record;

        if (adr >= 90) {
            record = recordBasedonAdr.greaterThan90;
        } else if (adr < 90 && adr >= 80) {
            record = recordBasedonAdr.between80And90;
        } else {
            record = recordBasedonAdr.lessThan80;
        }

        record.update(game.outcome);
    });

    return recordBasedonAdr;
}

function calculateRecordBasedOnFriends(games) {
    const recordBasedOnFriends = {};

    games.forEach(game => {
        game.friends.forEach(friend => {
            if (!recordBasedOnFriends.hasOwnProperty(friend)) {
                recordBasedOnFriends[friend] = new Record();
            }

            recordBasedOnFriends[friend].update(game.outcome);
        });

        if (game.isPlayedWithMultipleFriends()) {
            const allFriendsInMatch = game.getAllFriendsInMatch();

            if (!recordBasedOnFriends.hasOwnProperty(allFriendsInMatch)) {
                recordBasedOnFriends[allFriendsInMatch] = new Record();
            }

            recordBasedOnFriends[allFriendsInMatch].update(game.outcome);
        }
    });

    return recordBasedOnFriends;
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
    const games = makeGames(lines);
    printRecordBasedOnAdr(calculateRecordBasedOnAdr(games));
    printRecordBasedOnFriends(calculateRecordBasedOnFriends(games));
}).catch(err => console.log(err));

const makeGames = lines => lines.map(data => new Game(data));