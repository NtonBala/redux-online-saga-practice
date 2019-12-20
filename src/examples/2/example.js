/**
 * Основная концепция инструкций в redux-saga — это эффекты.
 * Эффект — это JavaScript-объект, описывающий инструкцию к выполнению.
 * take, call, put, apply и др. — это фабрики, производящие эффекты для разных целей.
 *
 * Сага-генератор передает эффект (или результат выражения справа от yield) middleware-у,
 * который и выполняет основную логику, описанную эффектом (или выражением).
 * После выполнения операции middleware «пробрасывает» результат обратно внутрь генератора.
 */

// Core
import { take, call, apply, put } from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';
import { swapiActions } from '../../bus/swapi/actions';
import { api } from '../../Api';

// using take blocking effect we get action as take evaluation
// using watchers approach (takeEvery, takeLatest) we get action as worker sage first parameter
export function* runExample() {
    while (true) {
        const action = yield take(types.FETCH_PLANETS_ASYNC);
        console.log('-> action:', action);

        yield put(swapiActions.setIsFetching(true));
        const response = yield call(api.fetchPlanets, [ action.payload ]);
        const data = yield apply(response, response.json);

        yield put(swapiActions.fillPlanets(data.results));
        yield put(swapiActions.setIsFetching(false));
    }
}
