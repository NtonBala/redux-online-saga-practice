/**
 * Существуют блокирующие и неблокирующие эффекты.
 * Например, take — блокирующий эффект.
 * Достигнув эффекта take генератор заморозится до тех пор,
 * пока не произойдет dispatch экшена с ожидаемым паттерном.
 *
 * call тоже блокирует поток выполнения генератора в том случае, если ему
 * возвращается промис.
 * 
 * Если нужно вызвать другой генератор из генератора,
 * лучше делать это через эффект call так, как в таком случше лучше тестить.
 */

// Core
import { take, put, call, apply, delay } from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';
import { swapiActions } from '../../bus/swapi/actions';
import { api } from '../../Api';

function* fetchPlanets(action) {
    console.log('-> fetchPlanets starts work');
    const response = yield call(api.fetchPlanets, action.payload);
    const data = yield apply(response, response.json);

    console.log('-> fetchPlanets finishes work');

    return data;
}

export function* runExample() {
    while (true) {
        const action = yield take(types.FETCH_PLANETS_ASYNC);

        yield put(swapiActions.setIsFetching(true));
        yield delay(1000);

        // calling another generator with call effect
        const data = yield call(fetchPlanets, action);
        console.log('-> runExample proceeds');

        yield put(swapiActions.fillPlanets(data.results));
        yield put(swapiActions.setIsFetching(false));
    }
}
