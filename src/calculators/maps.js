import Record from '../record';

export const printRecordBasedOnMaps = (games) =>
    print(
        calculateRecordBasedOnMaps(games),
        'Record based on maps'
    );

export const printRecordBasedOnMapsTable = (games, indentation) =>
    print(
        calculateRecordBasedOnMaps(games),
        '',
        indentation
    );

function calculateRecordBasedOnMaps(games) {
    const recordBasedOnMaps = {
        de_inferno: new Record(),
        de_dust2: new Record(),
        de_overpass: new Record(),
        de_train: new Record(),
        de_cbble: new Record(),
        de_mirage: new Record(),
        de_nuke: new Record(),
        de_cache: new Record()
    };

    return games.reduce((records, game) => {
        records[game.map].update(game.outcome);

        return records;
    }, recordBasedOnMaps);
}

function print(recordBasedOnMaps, title = '', indentation = '') {
    if (title) {
        console.log(`\n${title}`);
        console.log('------------------------');
    }

    Object.keys(recordBasedOnMaps).forEach(map => {
        const record = recordBasedOnMaps[map];

        if (!record.isEmpty()) {
            console.log(`${indentation}${map}: ${record.format()}`);
        }
    });
}
