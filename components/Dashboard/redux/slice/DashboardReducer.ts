import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DashboardState = {
    sideChaninLoading: boolean,
    getCustodialChainUrlData: any,
    userDataLoading: boolean,
    userSavedSuccesssfully: any,
    userListLoading: Boolean,
    userList: []
};

const initialState = {
    getCustodialChainUrlData: {},
    sideChaninLoading: false,
    userDataLoading: false,
    userSavedSuccesssfully: null,
    userListLoading: false,
    userList: []
} as DashboardState;

const dashboardReducer = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        getCustodialChainUrl(state) {
            console.log("getCustodialChainUrl reducer ");

            state.sideChaninLoading = true;
        },
        getCustodialChainUrlSuccess(state, action: PayloadAction<any>) {
            state.getCustodialChainUrlData = { ...action.payload?.User }
            state.sideChaninLoading = false;
        },
        getCustodialChainUrlFaliure(state) {
            state.sideChaninLoading = false
        },
        addUserDetails(state, action: PayloadAction<any>) {
            state.userDataLoading = true
        },
        addUserDetailsSuccess(state, action: PayloadAction<any>) {
            console.log("REDUCER DASH USER SUCC ", action);
            state.userDataLoading = false
            state.userSavedSuccesssfully = true;
        },
        addUserDetailsFailure(state, action: PayloadAction<any>) {
            console.log("REDUCER DASH USER FAIl ", action);
            state.userDataLoading = false
            state.userSavedSuccesssfully = false;

        },
        getUserList(state) {
            state.userListLoading = true
        },
        getUserListSuccess(state, action: PayloadAction<any>) {
            state.userList = action.payload;
            state.userListLoading = false
        },
        getUserListFaliure(state, action: PayloadAction<any>) {
            state.userList = [...action.payload.Data] as any;
            state.userListLoading = false
        }

    },
});

export const { getCustodialChainUrlSuccess, getCustodialChainUrl, getCustodialChainUrlFaliure,
    addUserDetails, addUserDetailsSuccess, addUserDetailsFailure,
    getUserList, getUserListSuccess, getUserListFaliure } = dashboardReducer.actions;

export default dashboardReducer.reducer;
