// Core
import { all } from 'redux-saga/effects';

// Instruments
import { runExample } from '../examples/10';

export function* rootSaga() {
    try {
        yield all([ runExample() ]);
    } catch (error) {
        console.log('→ error caught by rootSaga:\n', error);
    }
}
