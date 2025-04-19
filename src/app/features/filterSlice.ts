import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type StatusFilter = 'All' | 'To Do' | 'In Progress' | 'Completed' | 'Blocked';
type PriorityFilter = 'All' | 'Low' | 'Medium' | 'High' | 'Urgent';

interface FilterState {
    status: StatusFilter;
    priority: PriorityFilter;
    assignee: string; // You could use '' for "All"
    tag: string; // Same here
    searchQuery: string;
}

const initialState: FilterState = {
    status: 'All',
    priority: 'All',
    assignee: '',
    tag: '',
    searchQuery: '',
};

export const filterSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
            state.status = action.payload;
        },
        setPriorityFilter: (state, action: PayloadAction<PriorityFilter>) => {
            state.priority = action.payload;
        },
        setAssigneeFilter: (state, action: PayloadAction<string>) => {
            state.assignee = action.payload;
        },
        setTagFilter: (state, action: PayloadAction<string>) => {
            state.tag = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        resetFilters: () => initialState,
    },
});

export const {
    setStatusFilter,
    setPriorityFilter,
    setAssigneeFilter,
    setTagFilter,
    setSearchQuery,
    resetFilters,
} = filterSlice.actions;

export const selectFilters = (state: RootState) => state.filters;

export default filterSlice.reducer;
