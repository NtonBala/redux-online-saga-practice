/**
 * Эффект takeLatest не блокирует поток, и похож на take + fork.
 *
 * Однако при попытке начать новый task до завершения предыдущего — предыдущий
 * task будет отменён с помощью эффекта cancel.
 * То есть до конца единовременно выполнится лишь тот task, который запустился последним.
 * 
 * Если быть точным, каждый новый таск - а это сага-аргумент takeLatest,
 * будет начат с помощью fork. Затем будет выполенена проверка на предмет того,
 * есть ли какой-либо предыдущий форкнутый таск который еще раннится и если есть,
 * он будет отменен.
 */

// Core
import { takeLatest, put, call, apply, delay } from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';
import { swapiActions } from '../../bus/swapi/actions';
import { api } from '../../Api';

function* fetchPlanets(action) {
    console.log('-> start fetchPlanets');
    yield delay(1000);

    const response = yield call(api.fetchPlanets, action.payload);
    const data = yield apply(response, response.json);

    yield put(swapiActions.fillPlanets(data.results));
    console.log('-> finish fetchPlanets');
}

export function* runExample() {
    yield takeLatest(types.FETCH_PLANETS_ASYNC, fetchPlanets);
}
