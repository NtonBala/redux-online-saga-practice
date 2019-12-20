/**
 * Сага-генератор умеет делегировать поток выполнения другому генератору,
 * используя встроенный в JavaScript механизм делегирования — yield *.
 * 
 * Недостатком такого подхода становится то,
 * что такой подход, делает тестирование саги менее удобным.
 */

// Core
import { take, put, call, apply } from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';
import { swapiActions } from '../../bus/swapi/actions';
import { api } from '../../Api';

function* fetchPlanets(action) {
    console.log('-> 2');
    const response = yield call(api.fetchPlanets, action.payload);
    console.log('-> 3');
    const data = yield apply(response, response.json);
    console.log('-> 4');

    return data;
}

export function* runExample() {
    while (true) {
        const action = yield take(types.FETCH_PLANETS_ASYNC);

        yield put(swapiActions.setIsFetching(true));
        console.log('-> 1');
        const data = yield* fetchPlanets(action);
        console.log('-> 5');

        yield put(swapiActions.fillPlanets(data.results));
        yield put(swapiActions.setIsFetching(false));
    }
}
