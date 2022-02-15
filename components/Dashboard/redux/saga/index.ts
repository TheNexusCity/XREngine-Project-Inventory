import { all } from 'redux-saga/effects';
import SetupSaga from './SetupSaga';
import DashboardSaga from './DashboardSaga';

export default function* rootSaga() {
  yield all([SetupSaga(), DashboardSaga()]);
}
