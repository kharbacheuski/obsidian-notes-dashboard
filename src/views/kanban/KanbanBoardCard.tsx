import { Dispatch, memo, SetStateAction } from "react";
import { TFile } from "obsidian";
import IconButton from "../../components/IconButton";
import { useApp } from "./KanbanBoard";

interface Props {
    file: TFile;
    columnName: KanbanColumn["name"];
    setColumns: Dispatch<SetStateAction<KanbanColumn[]>>
}

function KanbanCard({file, columnName, setColumns}: Props) {
    const app = useApp();

    const cache = app.metadataCache.getFileCache(file);
    const fileTags = cache?.tags?.map((t) => t.tag) ?? [];
    const dateStr = new Date(file.stat.mtime).toLocaleString();

    const removeFile = () => {
        setColumns(prev => prev.map(col => {
            if(col.name == columnName)
                return {
                    ...col,
                    pages: col.pages.filter(f => f.basename !== file.basename)
                }
            else return col
        }))
    }

    return (
        <div
            className="kanban-card"
            onClick={() =>
                app.workspace.openLinkText(file.path, "", true)
            }
        >
            <div className="kanban-card-content">
                <div className="kanban-card-title">
                    {file.basename}
                </div>

                <div className="kanban-card-date">
                    {dateStr}
                </div>

                {fileTags.length > 0 && (
                    <div className="kanban-card-tags">
                        {fileTags.map((tag) => (
                            <span
                                key={tag}
                                className="kanban-card-tag"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <IconButton
                icon="x"
                onClick={removeFile}
            />
        </div>
    );
}

export default memo(KanbanCard)