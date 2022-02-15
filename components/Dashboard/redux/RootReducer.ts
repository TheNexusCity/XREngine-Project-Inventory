import { combineReducers } from '@reduxjs/toolkit';
import setupReducer from './slice/SetupReducer';
import dashboardReducer from './slice/DashboardReducer';

const rootReducer = (history: any) => combineReducers({
  setup: setupReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
