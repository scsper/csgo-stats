const WIN = 'win';
const LOSS = 'loss';

export default class Record {
    constructor() {
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
    }

    update(outcome) {
        if (outcome === WIN) {
            this.wins++;
        } else if (outcome === LOSS) {
           this.losses++;
        } else {
           this.ties++;
        }
    }

    format(record) {
        return `${this.wins}-${this.losses}-${this.ties}`;
    }
}