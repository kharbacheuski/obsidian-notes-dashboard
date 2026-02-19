import { TFile } from "obsidian";
import { useCallback, useReducer } from "react";

export interface KanbanColumn {
    name: string;
    pages: TFile[];
}

type Action =
    | { type: "init"; payload: KanbanColumn[] }
    | { type: "add-column"; payload: { name: string } }
    | { type: "remove-column"; payload: { name: string } }
    | { type: "add-card"; payload: { columnName: string; file: TFile } }
    | { type: "remove-card"; payload: { columnName: string; file: TFile } }

function reducer(state: KanbanColumn[], action: Action): KanbanColumn[] {
    switch (action.type) {
        case "init":
            return action.payload;

        case "add-column":
            if (state.some(c => c.name === action.payload.name)) {
                return state;
            }

            return [...state, { name: action.payload.name, pages: [] }];

        case "remove-column":
            return state.filter(c => c.name !== action.payload.name);

        case "add-card":
            return state.map(col =>
                col.name === action.payload.columnName
                    ? {
                          ...col,
                          pages: col.pages.some(p => p.path === action.payload.file.path)
                              ? col.pages
                              : [...col.pages, action.payload.file]
                      }
                    : col
            );

        case "remove-card":
            return state.map(col =>
                col.name === action.payload.columnName
                    ? {
                          ...col,
                          pages: col.pages.filter(
                              p => p.basename !== action.payload.file.basename
                          )
                      }
                    : col
            );

        default:
            return state;
    }
}

export function useKanbanState(initial: KanbanColumn[]) {
    const [columns, dispatch] = useReducer(reducer, initial);

    const addColumn = useCallback(
        (name: string) =>
            dispatch({ type: "add-column", payload: { name } }),
        []
    );

    const removeColumn = useCallback(
        (name: string) =>
            dispatch({ type: "remove-column", payload: { name } }),
        []
    );

    const addCard = useCallback(
        (columnName: string, file: TFile) =>
            dispatch({
                type: "add-card",
                payload: { columnName, file }
            }),
        []
    );

    const removeCard = useCallback(
        (columnName: string, file: TFile) =>
            dispatch({
                type: "remove-card",
                payload: { columnName, file }
            }),
        []
    );

    return {
        columns,
        addColumn,
        removeColumn,
        addCard,
        removeCard
    };
}