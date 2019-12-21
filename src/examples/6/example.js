/**
 * Например — процесс можно отменить с помощью эффекта cancel.
 * 
 * Логин, логаут, автентикейт имеет смысл делать через подход while + блкокирующий take
 * Ведь не имеет смысла логиниться несколько раз, логин все равно будет 1
 * 
 * Интересная заметка - даже если не использовать блокирующий подход,
 * можно заблокировать возможность отправки повторных запросов чисто через UI:
 * использую start/stop Fetching и блокируя интерфейс через disabled
 * 
 * Подход с cancel в этом примере, можно применить на практике, если например
 * делаются табы (вкладки) и по открытию вкладки загружается контент для нее
 * В таком случае в если пользователь перешел сначала на одну вкладку, а потом на другую
 * пойдут два запроса и первый можно отменить
 * С другой стороны, если не отменать, то когда пользователь вернется на первую
 * там уже будет загруженный контент. То есть это надо обдумывать.
 * Принять решение в такой ситуации можно методом проб - побробовав и так и так.
 * Это достаточно хороший подход для многих ситуаций.
 */

// Core
import {
    take,
    put,
    call,
    apply,
    fork,
    cancel,
    cancelled,
    delay,
} from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';
import { swapiActions } from '../../bus/swapi/actions';
import { api } from '../../Api';

function* fetchPlanets(action) {
    try {
        yield delay(2000);

        const response = yield call(api.fetchPlanets, action.payload);
        const data = yield apply(response, response.json);

        yield put(swapiActions.fillPlanets(data.results));
    } catch (error) {
        console.log('→ error', error);
    } finally {
        // эффект cancelled проверяет была ли текущая сага отменена эффектом cancel
        if (yield cancelled()) {
            console.log('→ cancelled!', action.type);
        }
    }
}

export function* runExample() {
    const tasks = [];

    while (true) {
        // take может смотреть за множеством экшенов
        const action = yield take([
            types.FETCH_PLANETS_ASYNC,
            types.CANCEL_FETCH,
        ]);

        if (tasks.length && action.type === types.CANCEL_FETCH) {
            for (const task of tasks) {
                // yield должен быть напрямую потомком генератора
                // то есть, пробежаться по таскам через
                // tasks.forEach((task) => { yield cancel(task)});
                // не выйдет, так как в этом случае мы помещаем его в промежуточный коллбэк
                yield cancel(task);
            }
            tasks.length = 0;

            continue;
        }

        const task = yield fork(fetchPlanets, action);

        tasks.push(task);

        console.log('→ tasks', tasks);
    }
}
