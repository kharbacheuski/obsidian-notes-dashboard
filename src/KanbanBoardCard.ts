import { App, Notice, TFile } from "obsidian";
import actions from "./utils/actions.utils";
import { createIconButton } from "./utils/dom.utils";

export default class KanbanBoardCard {
    private card: HTMLDivElement

    constructor(
        private app: App,
        private updateBoard: (action: (fm: DashboardFrontmatter) => void) => Promise<void>,
        private cardsContainer: HTMLDivElement
    ) { }

    render(file: TFile, column: KanbanColumn) {
        this.card = this.cardsContainer.createDiv({cls: "kanban-card"})

        const content = this.card.createDiv({cls: "kanban-card-content"});
        
        content.createDiv({cls: "kanban-card-title", text: file.basename});
        
        const dateStr = new Date(file.stat.mtime).toLocaleString();
        content.createDiv({cls: "kanban-card-date", text: dateStr})

        const cache = this.app.metadataCache.getFileCache(file);
        const fileTags = cache?.tags?.map(t => t.tag) ?? [];

        if (fileTags.length > 0) {
            const tagsEl = content.createDiv({cls: "kanban-card-tags"});

            fileTags.forEach(tag => tagsEl.createSpan({cls: "kanban-card-tag", text: tag}));
        }

        createIconButton(this.card, "x", async () => {
            await this.updateBoard(fm => actions.card.remove(fm, column.name, file.basename));
        })

        this.card.addEventListener("click", () => {
            this.app.workspace.openLinkText(file.path, "", true);
        });
    }
}