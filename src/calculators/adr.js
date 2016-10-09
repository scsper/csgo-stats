import Record from '../record';

export const printRecordBasedOnAdr = games => print(calculateRecordBasedOnAdr(games));

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

function print(recordBasedonAdr) {
    const {lessThan80, between80And90, greaterThan90} = recordBasedonAdr;

    console.log('\nRecord based on ADR');
    console.log('------------------------');
    console.log('ADR < 80:', lessThan80.format());
    console.log('80 < ADR < 90:', between80And90.format());
    console.log('90 < ADR:', greaterThan90.format());
}
