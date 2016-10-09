export default class Game {
    constructor(data) {
        const commentPieces = data[45].split('|');

        this.id = data[1];
        this.adr = parseFloat(data[29]);
        this.outcome = commentPieces[0].trim();
        this.friends = commentPieces.length > 1 ? commentPieces[1].split(':').map(friend => friend.trim()) : [];
    }

    getAllFriendsInMatch() {
        return this.friends.join(',');
    }

    isPlayedWithMultipleFriends() {
        return this.friends.length > 1;
    }
}