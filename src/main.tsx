import { Plugin, TFile } from "obsidian";
import { createRoot } from "react-dom/client";
import KanbanBoard from "./views/kanban/KanbanBoard";

export default class KanbanDashboardPlugin extends Plugin {
    onload() {
        this.registerMarkdownPostProcessor((el, ctx) => {
            const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
            if (!(file instanceof TFile)) return;

            const cache = this.app.metadataCache.getFileCache(file);
            if (!cache?.frontmatter?.dashboard) return;

            const container = el.createDiv();
            const root = createRoot(container);

            root.render(
                <KanbanBoard
                    app={this.app}
                    sourceFile={file}
                />
            );

            this.register(() => root.unmount());
        });
    }
}
