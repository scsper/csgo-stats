import fs from 'fs';
import path from 'path';
import Record from './record';
import Game from './game';
import {printRecordBasedOnAdr} from './calculators/adr';
import {printRecordBasedOnFriends} from './calculators/friends';

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

readAndParseCsv('./csv/csgo_stats100816.csv').then(lines => {
    checkHeadings(lines.shift());
    
    const games = makeGames(lines);
    
    printRecordBasedOnAdr(games);
    printRecordBasedOnFriends(games);
}).catch(err => console.log(err));

const makeGames = lines => lines.map(data => new Game(data));