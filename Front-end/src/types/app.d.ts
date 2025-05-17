export interface ResponseFromServer<T> {
	success: boolean;
	data: T;
}

export interface AppGlobalState {
	loading: boolean;
}

export interface ListPaginationResponse<T> {
	data: T[];
	pagination: Pagination;
}

export interface Pagination {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
}


export interface ThunkErrors {
    errorMessage: string;
    data?: any;
    success?: boolean
}

export type Selector<S> = (state: RootState) => S;


interface Option {
    value: string;
    label: string;
}

interface Payment {
	amount: number;
	message: string;
}