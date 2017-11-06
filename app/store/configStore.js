import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger'; // debug mode
//https://github.com/rt2zz/redux-persist
import {persistStore, autoRehydrate, createTransform} from 'redux-persist';
import {AsyncStorage} from 'react-native';


let middlewares = [thunk];

if (__DEV__) {
    const logger = createLogger({ collapsed: true });
    middlewares = [...middlewares];//, logger];
} else {
    middlewares = [...middlewares];
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(allReducers, initialState, onComplete: ()=>void) {
    const store = createStore(
        allReducers,
        initialState,
        compose(
            applyMiddleware(...middlewares),
            autoRehydrate()
        )
    );
    let loadingTransform = createTransform(
        (state) => ({...state}), // in
        (state) => ({...state}), // out
    )
    let opt = {
        storage: AsyncStorage,
        //transforms: [loadingTransform],
        blacklist: ['route'],
    };
    var persistor = persistStore(store, opt, onComplete);
    return [store, persistor];
}
