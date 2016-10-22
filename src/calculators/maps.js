import Record from '../record';

export const printRecordBasedOnMaps = games => print(calculateRecordBasedOnMaps(games));

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

function print(recordBasedOnMaps) {
    console.log('\nRecord based on maps');
    console.log('------------------------');

    Object.keys(recordBasedOnMaps).forEach(map => {
        console.log(`${map}: ${recordBasedOnMaps[map].format()}`);
    });
}
