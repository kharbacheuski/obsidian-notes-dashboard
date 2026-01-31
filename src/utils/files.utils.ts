import { App, Notice, TFile } from "obsidian";
import { CURRENT_LOCALE } from "src/locale";

export function getFilesForColumn(app: App, column: KanbanColumn, fm: DashboardFrontmatter): TFile[] {
    if (!column.pages?.length) return [];

    try {
        const allFiles = app.vault.getFiles();
        const files: TFile[] = [];

        for (const name of column.pages) {
            const f = allFiles.find(file => file.basename === name);
            if (f) files.push(f);
        }

        const sorted = sortFiles(files, fm.sort);

        return sorted;
    } catch (error) {
        console.error(CURRENT_LOCALE.failedGettingFiles, error);
        new Notice(CURRENT_LOCALE.failedGettingFiles)
        return [];
    }
}

function sortFiles(files: TFile[], sort?: string): TFile[] {
    const sorted = [...files];

    switch (sort) {
        case "created":
            return sorted.sort((a, b) => b.stat.ctime - a.stat.ctime);
        case "name":
            return sorted.sort((a, b) => a.basename.localeCompare(b.basename));
        case "modified": 
            return sorted.sort((a, b) => b.stat.mtime - a.stat.mtime);
        default:
            return sorted.sort((a, b) => a.stat.mtime - b.stat.mtime);
    }
}