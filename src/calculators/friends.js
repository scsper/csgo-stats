import Record from '../record';

export const printRecordBasedOnFriends = games => print(calculateRecordBasedOnFriends(games));

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

function print(recordBasedOnFriends) {
    console.log('\nRecord based on friends');
    console.log('------------------------');

    Object.keys(recordBasedOnFriends).forEach(friends => {
        console.log(`${friends}: ${recordBasedOnFriends[friends].format()}`);
    });
}
