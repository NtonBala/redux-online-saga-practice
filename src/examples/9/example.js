/**
 * Эффект takeEvery — это утилита-надстройка над эффектом take.
 * takeEvery не блокирует поток и похож на комбинацию take + fork.
 * В каком-то смысле похож на redux-thunk.
 */

// Core
import { takeEvery, take, put, call, apply } from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';
import { swapiActions } from '../../bus/swapi/actions';
import { api } from '../../Api';

function* fetchPlanets(action) {
    console.log('-> start fetchPlanets');
    const response = yield call(api.fetchPlanets, action.payload);
    const data = yield apply(response, response.json);

    yield put(swapiActions.fillPlanets(data.results));
    console.log('-> finish fetchPlanets');
}

// В данном случае runExample выступает в качестве watcher'а.
export function* runExample() {
    console.log('-> start runExample');
    yield takeEvery(types.FETCH_PLANETS_ASYNC, fetchPlanets); // first try "take" here
    console.log('-> finish runExample');
}
