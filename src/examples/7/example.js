/**
 * Можно осуществлять даже более сложный контроль над параллельными задачами.
 */

// Core
import { take, fork, cancel, all } from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';

// Workers
import { fetchEntity } from './fetchEntity';

// Code is refactored with all effect

const tasks = [];

function* watchFetchPlanetsAsync() {
    while (true) {
        const action = yield take(types.FETCH_PLANETS_ASYNC);
        const planetsTask = yield fork(fetchEntity, action, 'Planets');
        console.log(action);

        tasks.push(planetsTask);
    }
}

function* watchCancelFetch() {
    while (true) {
        yield take(types.CANCEL_FETCH);

        if (tasks.length) {
            for (const task of tasks) {
                yield cancel(task);
            }
            tasks.length = 0;
        }
    }
}

export function* watchFetchAll() {
    while (true) {
        const action = yield take(types.FETCH_ALL);

        const peopleTask = yield fork(fetchEntity, action, 'People');
        const vehiclesTask = yield fork(fetchEntity, action, 'Vehicles');
        const planetsTask = yield fork(fetchEntity, action, 'Planets');

        tasks.push(peopleTask);
        tasks.push(vehiclesTask);
        tasks.push(planetsTask);
    }
}

export function* runExample() {
    yield all([ watchFetchPlanetsAsync(), watchCancelFetch(), watchFetchAll() ]);
}
