import { Dispatch, memo, SetStateAction } from "react";
import { AddNoteModal } from "../../components/AddNoteModal";
import { CURRENT_LOCALE } from "../../locale";

import KanbanCard from "./KanbanBoardCard";
import IconButton from "../../components/IconButton";
import { useApp } from "./KanbanBoard";

interface Props {
    column: KanbanColumn;
    setColumns: Dispatch<SetStateAction<KanbanColumn[]>>
}

function KanbanColumn({
    column,
    setColumns,
}: Props) {
    const app = useApp();

    const openAddNoteModal = () => {
        const modal = new AddNoteModal(app, (file) => {
            if (!file) return;

            setColumns(prev => prev.map(col => {
                if(col.name == column.name)
                    return {
                        ...col,
                        pages: [...col.pages, file]
                    }
                else return col
            }))
        });

        modal.open();
    };

    const removeColumn = () => {
        setColumns(prev => prev.filter(c => c.name !== column.name))
    }

    return (
        <div className="kanban-column" data-column-name={column.name}>
            <div className="kanban-header">
                <span>{column.name}</span>

                <div className="kanban-column-actions">
                    <IconButton
                        icon="plus"
                        onClick={openAddNoteModal}
                    />

                    <IconButton
                        icon="trash"
                        onClick={removeColumn}
                    />
                </div>
            </div>

            <div className="kanban-cards">
                {column.pages?.length === 0 ? (
                    <div className="kanban-cards-empty">
                        {CURRENT_LOCALE.emptyColumn}
                    </div>
                ) : (
                    column.pages?.map((file) => (
                        <KanbanCard
                            key={file.path}
                            file={file}
                            columnName={column.name}
                            setColumns={setColumns}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default memo(KanbanColumn, (prev, next) => {
    return (
        prev.column.name === next.column.name &&
        prev.column.pages?.join(",") === next.column.pages?.join(",")
    )
});