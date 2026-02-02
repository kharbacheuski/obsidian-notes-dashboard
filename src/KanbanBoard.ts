import { App, Notice, TFile, TextComponent } from "obsidian";
import { updateFrontmatter } from "./utils/frontmatter.utils";
import actions from "./utils/actions.utils";
import { CURRENT_LOCALE } from "./locale";
import kanbanBoardColumn from "./KanbanBoardColumn";
import { createIconButton } from "./utils/dom.utils";

export default class KanbanBoard {
    private host: HTMLElement;
    private root: HTMLElement;

    constructor(
        private app: App,
        private sourceFile: TFile,
    ) {}

    private getFrontmatter(): DashboardFrontmatter {
        const cache = this.app.metadataCache.getFileCache(this.sourceFile);
        return structuredClone(cache?.frontmatter ?? {});
    }

    mount(container: HTMLElement) {
        this.host = container;
        this.root = this.render(this.host);
        this.host.append(this.root);
    }

    private render(host: HTMLElement): HTMLElement {
        const fm = this.getFrontmatter();

        const wrapper = host.createDiv({cls: "kanban-board-wrapper"});
        const board = wrapper?.createDiv({cls: "kanban-board"});

        const columns = fm.columns ?? [];

        if (columns.length === 0) {
            board?.createDiv({cls: "kanban-board-empty", text: CURRENT_LOCALE.emptyBoard})
        } else {
            columns.forEach(c => new kanbanBoardColumn(this.app, this.updateBoard, fm, board).render(c))
        }

        createIconButton(wrapper, "plus", this.renderInlineColumnInput.bind(this))

        return wrapper;
    }

    private updateBoard = async (action: (fm: DashboardFrontmatter) => void) => {
        try {
            const next = this.getFrontmatter();
            action(next);

            await updateFrontmatter(this.app, this.sourceFile, fm => {
                Object.assign(fm, next);
            });
        }
        catch(e) {
            console.error(CURRENT_LOCALE.failedUpdateDashboard, e)
            new Notice(CURRENT_LOCALE.failedUpdateDashboard)
        }
    }

    rerender() {
        if (!this.host) return;

        this.host.empty();
        this.root = this.render(this.host);
        this.host.append(this.root);
    }

    private renderInlineColumnInput() {
        if (!this.root) return;
        if (this.root.querySelector(".kanban-column--editing")) return;

        const board = this.root.querySelector(".kanban-board");
        if (!board) return;

        const column = board.createDiv({cls: "kanban-column --editing"});
        const header = column.createDiv({cls: "kanban-header"});
        const inputWrapper = header.createDiv({cls: "kanban-column-input-wrapper"});

        const textInput = new TextComponent(inputWrapper);
        textInput.inputEl.placeholder = CURRENT_LOCALE.columnName;
        textInput.inputEl.autocomplete = "off";
        textInput.inputEl.focus();

        let committed = false;

        const commit = async () => {
            if (committed) return;
            committed = true;

            const name = textInput.getValue().trim();
            column.remove();

            if (!name) return;

            await this.updateBoard(fm => actions.column.create(fm, name));
        };

        textInput.inputEl.addEventListener("keydown", e => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") column.remove();
        });

        textInput.inputEl.addEventListener("blur", commit);
    }
}