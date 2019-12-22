/**
 * redux-saga также предоставляет возможность имплементировать очередь выполнения эффектов.
 *
 * Очередь в redux-saga это по сути стек. Его можно создать с помощью эффекта "actionChannel".
 */

// Core
import { take, call, actionChannel } from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';

// Workers
import { fetchEntity } from './fetchEntity';

export function* runExample() {
    const buffer = yield actionChannel(types.FETCH_ALL); // также может принимать массив экшенов

    // actionChannel работает таким образом, что
    // каждый новый экшен запущенный в канал обрабатывается после того,
    // как закончился обрабатываться предыдущий.

    // То есть, если канал примет, например массив [ types.FETCH_ALL, types.CANCEL_FETCH ],
    // и пользователь диспетчит последовательность экшенов:
    // FETCH_ALL, FETCH_ALL, CANCEL_FETCH, CANCEL_FETCH, FETCH_ALL...
    // то обработаны они будут именно в такой последовательности
    // (console.log('FETCH_ALL'), console.log('FETCH_ALL), console.log(CANCEL_FETCH),
    // console.log(CANCEL_FETCH), console.log(FETCH_ALL)...)

    // То есть канал (стек) - это как мыть посуду :-)
    // Сначала кладываем стопочку из помытых тарелок (actionChannel),
    // а потом по одной берем оттуда (take) и смываем :-)

    // Вторым аргументом actionChannel принимает объект Buffer,
    // который используется для создания буфер-стратегии для канала.
    // Например, slicing buffer - скажем лимит стека 10 елементов, когда приходит 11
    // то ошибка не возникает, а вместо этого удаляешь 1, а 11 становится 10-ым.
    // Таких буферов в redux-saga около 5 (смотреть доки).

    // Кроме actionChannel есть еще evenChannel
    // Им можно отлавливать разные события (даже события DOM)

    // Эффект "flush" удаляет все забуферизированный экшены из канала и возвращает их,
    // так что удаленные экшены могут быть использованы если нужно.
    while (true) {
        const action = yield take(buffer);

        yield call(fetchEntity, action, 'Planets');
        yield call(fetchEntity, action, 'Vehicles');
        yield call(fetchEntity, action, 'People');
    }
}

// Слабой стороной redux-saga есть то, что у нее сложный исходный код,
// что приводит к тому, что ее версии медленно апгрейдятся, ее сложно мейнтейнить
// и она сложно дебажиться в проектах.

// Для дальнейшего развития можно посмотреть:
// redux-observable и rxjs
