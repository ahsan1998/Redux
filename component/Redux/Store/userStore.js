import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import userDetailReducer from '../Reducers/userDetailReducer';
// Middleware: Redux Persist Config

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        "userDetailReducer"
    ],
    blacklist: [],
};
const persistedReducer = persistReducer(persistConfig, userDetailReducer)
const store = createStore(
    persistedReducer,
    applyMiddleware(
        createLogger(),
    ),
);
let persistor = persistStore(store);
export {
    store,
    persistor,
};