// Core
import { all } from 'redux-saga/effects';

// Instruments
import { runExample } from '../examples/2';

export function* rootSaga() {
    try {
        yield all([ runExample() ]);
    } catch (error) {
        console.log('→ error caught', error);
    }
}
