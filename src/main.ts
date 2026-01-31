import { Plugin, TFile } from "obsidian";
import KanbanBoard from "./KanbanBoard";
import { CURRENT_LOCALE } from "./locale";

export default class KanbanDashboardPlugin extends Plugin {
    private dashboards = new Map<string, KanbanBoard>();
    private rerenderScheduled = new Set<string>();

    onload() {
        this.addCommand({
            id: "open-notesdashboard-note",
            name: CURRENT_LOCALE.openNote,
            callback: () => {
                const file = this.app.workspace.getActiveFile();
                if (file) this.app.workspace.getLeaf(false).openFile(file);
            },
        });

        this.registerMarkdownPostProcessor((el, ctx) => {
            if (el.querySelector(".kanban-board-wrapper")) return;

            const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
            if (!(file instanceof TFile)) return;

            const cache = this.app.metadataCache.getFileCache(file);
            if (!cache?.frontmatter?.dashboard) return;

            let dashboard = this.dashboards.get(file.path);

            if (!dashboard) {
                dashboard = new KanbanBoard(this.app, file);
                this.dashboards.set(file.path, dashboard);

                this.registerEvent(
                    this.app.metadataCache.on("changed", changedFile => {
                        if (changedFile.path === file.path) {
                            this.scheduleRerender(file.path);
                        }
                    })
                );
            }

            dashboard.mount(el);
        });
    }

    private scheduleRerender(path: string) {
        if (this.rerenderScheduled.has(path)) return;

        this.rerenderScheduled.add(path);

        requestAnimationFrame(() => {
            const dashboard = this.dashboards.get(path);
            dashboard?.rerender();
            this.rerenderScheduled.delete(path);
        });
    }
}