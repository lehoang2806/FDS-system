import { Selector } from "@/types/app";
import { UserProfile } from "@/types/auth";
import { RootState } from "./reducer";

export const selectUserLogin: Selector<UserProfile|null> = (state: RootState) => {
    return state.auth.userInfo;
}

export const selectIsAuthenticated: Selector<boolean> = (state: RootState) => {
    return state.auth.isAuthenticated;
}

export const selectToken: Selector<string|null> = (state: RootState) => {
    return state.auth.token;
}