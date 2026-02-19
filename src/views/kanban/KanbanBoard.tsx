import { memo, useLayoutEffect, useState } from "react";
import { App, TFile } from "obsidian";
import { getFrontmatter, updateFrontmatter } from "../../utils/frontmatter.utils";
// import actions from "../../utils/actions.utils";
import { CURRENT_LOCALE } from "../../locale";
import KanbanColumn from "./KanbanBoardColumn";
import IconButton from "../../components/IconButton";
import TextInput from "../../../src/components/TextInput";
import { createContext, useContext } from "react";
import { getFilesForColumn } from "src/utils/files.utils";

interface Props {
    app: App;
    sourceFile: TFile;
}


const AppContext = createContext<App | null>(null);

export const useApp = () => {
    const app = useContext(AppContext);
    if (!app) throw new Error("useApp must be used within AppProvider");
    return app;
};

function KanbanBoard({ app, sourceFile }: Props) {
    const [isAddingColumn, setIsAddingColumn] = useState(false);

    const [columns, setColumns] = useState<KanbanColumn[]>(() => {
        const fm = getFrontmatter(app);
        return fm.columns.map(col => ({
            name: col.name,
            pages: getFilesForColumn(app, col)
        })) ?? [];
    });

    useLayoutEffect(() => {
        updateFrontmatter(app, sourceFile, fm => {
            Object.assign(fm, {
                ...fm,
                columns: columns.map(col => ({
                    name: col.name,
                    pages: col.pages.map(p => p.basename)
                }))
            })
        });
    }, [columns]);

    const commitColumn = async (value: string) => {
        const name = value.trim();
        setIsAddingColumn(false);

        if (!name) return;

        setColumns(prev => [...prev, {name, pages: []}])
    };

    return (

        <div className="kanban-board-wrapper">
            <div className="kanban-board">
                <AppContext.Provider value={app}>
                    {columns.length === 0 ? (
                        <div className="kanban-board-empty">
                            {CURRENT_LOCALE.emptyBoard}
                        </div>
                    ) : (
                        columns.map((column) => (
                            <KanbanColumn
                                key={column.name}
                                column={column}
                                setColumns={setColumns}
                            />
                        ))
                    )}
                </AppContext.Provider>

                {isAddingColumn && (
                    <div className="kanban-column kanban-column--editing">
                        <div className="kanban-header">
                            <div className="kanban-column-input-wrapper">
                                <TextInput
                                    placeholder={CURRENT_LOCALE.columnName}
                                    autoFocus
                                    onCommit={commitColumn}
                                    onCancel={() => setIsAddingColumn(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

           <IconButton
                className="kanban-add-column"
                icon="plus"
                onClick={() => setIsAddingColumn(true)}
            />
        </div>
    );
}

export default memo(KanbanBoard);