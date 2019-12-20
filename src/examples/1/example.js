/**
 * В саге-генераторе можно вызывать нужные методы в явном виде, без использования эффектов.
 * Можно также комбинировать эффекты с явными операциями без эффектов.
 *
 * Однако для описаний практически любой инструкции в
 * Redux Saga существует специальный эффект.
 * Примеры эффектов в этом файле — take и put.
 * put — самый простой эффект, он работает как store.dispatch.
 * 
 * Однако предпочтительней использовать эффекты всегда.
 * Это улучшает тестируемость саги-генератора,
 * явность происходящего в ней, а также консистентность написаемого кода.
 */

// Core
import { take, put } from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';
import { swapiActions } from '../../bus/swapi/actions';
import { api } from '../../Api';

// watcher и worker одновременно
export function* runExample() {
    console.log('-> message 1');
    while (true) {
        // watcher, blocks current saga and then watches for action
        // call & apply are also effects that block
        const action = yield take(types.FETCH_PLANETS_ASYNC);
        console.log('-> message 2');

        //yield put(swapiActions.setIsFetching(true));
        const response = yield api.fetchPlanets(action.payload);
        const data = yield response.json();

        yield put(swapiActions.fillPlanets(data.results));
        //yield put(swapiActions.setIsFetching(false));
    }
}
