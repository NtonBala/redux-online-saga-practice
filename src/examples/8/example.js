/**
 * Существует ещё одна неблокирующая альтернатива fork (attached fork) — spawn (detached fork).
 *
 * Сага-генератор, возбуждённая с помощью spawn — «отсоединена» от породившей
 * её родительской саги.
 *
 * Она живёт в своём отдельном контексте, поэтому родительская сага
 * может быть легко убрана сборщиком мусора во время выполнения саги
 * порожденной с помощью spawn.
 *
 * Однако это так-же приводит к тому, что не обработанное исключение,
 * возбуждённое в такой саге — не сможет «всплыть» к родительской саге, и быть
 * там обработанным.
 */

// Core
import { take, spawn, delay, fork, call } from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';

function* errorSaga() {
    yield delay(3000);

    throw new Error(`
        В отличии от fork, spawn не сохраняет ссылку на вызвавшую родительскую сагу-генератор.
        Вместо этого spawn создаёт новый поток-ветвление от rootSaga.
        В случае с fork данная ошибка была-бы отловлена промежуточной родительской сагой-генератором.
        В данном случае, поскольку промежуточных саг больше нет, ошибку отловит rootSaga.
    `);
}

export function* runExample() {
    // from docs:
    // Errors from child tasks automatically bubble up to their parents.
    // If any forked task raises an uncaught error,
    // then the parent task will abort with the child Error,
    // and the whole Parent's execution tree
    // (i.e. forked tasks + the main task represented by the parent's body if it's still running)
    // will be cancelled.
    while (true) {
        try {
            const action = yield take(types.FETCH_PLANETS_ASYNC);

            yield spawn(errorSaga, action); // try fork and call here
            //throw new Error('-> exampleSaga #8 error');
        } catch (error) {
            console.log('-> The error from forked errorSaga will not be caught here, '
            + 'as it would automatically abort parent runExample saga #8. '
            + 'As result it will be caught by rootSaga instead.\n', error);
        }
    }
}
