import { App } from "obsidian";
import { AddNoteModal } from "./ui/AddNoteModal";
import actions from "./utils/actions.utils";
import { CURRENT_LOCALE } from "./locale";
import { getFilesForColumn } from "./utils/files.utils";
import KanbanBoardCard from "./KanbanBoardCard";
import { createIconButton } from "./utils/dom.utils";

export default class KanbanBoardColumn {
    private columnEl: HTMLDivElement

    constructor(
        private app: App,
        private updateBoard: (action: (fm: DashboardFrontmatter) => void) => Promise<void>,
        private fm: DashboardFrontmatter,
        private board: HTMLDivElement
    ) { }

    render(column: KanbanColumn) {
        this.columnEl = this.board.createDiv({cls: "kanban-column"});
        this.columnEl.dataset.columnName = column.name;

        this.renderColumnHeader(column)
        this.renderCards(column)
    }
    
    private renderColumnHeader(column: KanbanColumn): HTMLElement {
        const header = this.columnEl.createDiv({cls: "kanban-header"});

        header.createSpan({text: column.name})

        const columnActions = header.createDiv({cls: "kanban-column-actions"});

        createIconButton(columnActions, "plus", () => this.openAddNoteModal(column))
        createIconButton(columnActions, "trash", async (e) => {
            await this.updateBoard(fm => actions.column.remove(fm, column.name))
        })
                
        return header;
    }

    private openAddNoteModal(column: KanbanColumn) {
        const modal = new AddNoteModal(this.app, async file => {
            if (!file) return;
            await this.updateBoard(fm =>
                actions.card.create(fm, column.name, file.basename),
            );
        })
        modal.open();
    }

    private renderCards(column: KanbanColumn): HTMLElement {
        const container = this.columnEl.createDiv({cls: "kanban-cards"});

        const files = getFilesForColumn(this.app, column, this.fm);

        if (files.length === 0) {
            container.createDiv({cls: "kanban-cards-empty", text: CURRENT_LOCALE.emptyColumn});
        } else {
            files.forEach(file => new KanbanBoardCard(this.app, this.updateBoard, container).render(file, column))
        }

        return container;
    }
}