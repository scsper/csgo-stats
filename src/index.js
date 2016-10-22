import fs from 'fs';
import path from 'path';
import Record from './record';
import Game from './game';
import {printRecordBasedOnAdr} from './calculators/adr';
import {
    printRecordBasedOnIndividualFriends,
    printRecordBasedOnFriendCombinations
} from './calculators/friends';
import {printRecordBasedOnMaps} from './calculators/maps';

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

readAndParseCsv('./csv/csgostats_102216.csv').then(lines => {
    checkHeadings(lines.shift());

    const games = makeGames(lines);
    const individualFriendsToGamesMap = makeIndividualFriendsToGamesMap(games);
    const friendCombinationsToGamesMap = makeFriendCombinationsToGamesMap(games);

    printRecordBasedOnAdr(games);
    printRecordBasedOnMaps(games);
    printRecordBasedOnIndividualFriends(individualFriendsToGamesMap);
    printRecordBasedOnFriendCombinations(friendCombinationsToGamesMap);
}).catch(err => console.log(err));

const makeGames = lines => lines.map(data => new Game(data));

/**
 * This data captures the record of playing with one friend across all matches.
 * If A is friends with B, C, and D, and he plays the following games:
 *
 * A, B
 * A, B, C
 * A, B
 * A, B, C, D
 *
 * The map will look like:
 * B: 4 games
 * C: 2 games
 * D: 1 game
 */
const makeIndividualFriendsToGamesMap = games => games.reduce((map, game) => {
    game.friends.forEach(friend => {
        if (!map[friend]) {
            map[friend] = [];
        }

        map[friend].push(game);
    });

    return map;
}, Object.create(null));

/**
 * This data captures the record of playing with different friend combinations.
 * If A is friends with B, C, and D, and he plays the following games:
 *
 * A, B
 * A, B, C
 * A, B
 * A, B, C, D
 *
 * The map will look like:
 * B: 2 games
 * B, C: 1 game
 * B, C, D: 1 game
 */
const makeFriendCombinationsToGamesMap = games => games.reduce((map, game) => {
    let friends = '';

    if (game.isPlayedWithMultipleFriends()) {
        friends = game.getAllFriendsInMatch();
    } else {
        friends = game.friends[0];
    }

    if (!friends) {
        return map;
    }

    if (!map[friends]) {
        map[friends] = [];
    }

    map[friends].push(game);

    return map;
}, Object.create(null));
