import Record from '../record';

export const printRecordBasedOnIndividualFriends =
    individualFriendsToGamesMap => print(
        'Record based on individual friends',
        calculateRecordsBasedOnFriends(individualFriendsToGamesMap)
    );

export const printRecordBasedOnFriendCombinations =
    friendCombinationsToGamesMap => print(
        'Record based on friend combinations',
        calculateRecordsBasedOnFriends(friendCombinationsToGamesMap)
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

function print(string, recordBasedOnFriends) {
    console.log(`\n${string}`);
    console.log('------------------------');

    Object.keys(recordBasedOnFriends).forEach(friends => {
        console.log(`${friends}: ${recordBasedOnFriends[friends].format()}`);
    });
}
