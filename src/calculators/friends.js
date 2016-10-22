import Record from '../record';
import {printRecordBasedOnMapsTable} from './maps';

export const printRecordBasedOnIndividualFriends =
    individualFriendsToGamesMap => print(
        'Record based on individual friends',
        individualFriendsToGamesMap
    );

export const printRecordBasedOnFriendCombinations =
    friendCombinationsToGamesMap => print(
        'Record based on friend combinations',
        friendCombinationsToGamesMap
    );

function calculateRecordsBasedOnFriends(friendMap) {
    const recordBasedOnFriends = Object.create(null);

    Object.keys(friendMap).forEach(friend => {
        const games = friendMap[friend];
        const record = new Record();

        games.forEach(game => record.update(game.outcome));

        recordBasedOnFriends[friend] = record;
    });

    return recordBasedOnFriends;
}

function print(string, friendToGamesMap) {
    console.log(`\n${string}`);
    console.log('------------------------');

    Object.keys(friendToGamesMap).forEach(friend => {
        const games = friendToGamesMap[friend];
        const record = new Record();

        games.forEach(game => record.update(game.outcome));

        console.log(`${friend}: ${record.format()}`);
        printRecordBasedOnMapsTable(games, '  ');
    });
}
