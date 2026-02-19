import { App, Notice, TFile, TAbstractFile } from "obsidian";
import { CURRENT_LOCALE } from "src/locale";
import { getFrontmatter } from "./frontmatter.utils";

export const isFolder = (c: TAbstractFile) => !(c as Object).hasOwnProperty("extension")
export const isBaseFile = (c: TFile) => c instanceof TFile && c.extension === "base"

export function getFilesForColumn(app: App, column: KanbanAbstractColumn): TFile[] {
    if (!column.pages?.length) return [];

    const fm = getFrontmatter(app)

    try {
        const allFiles = app.vault.getFiles();
        const files: TFile[] = [];

        for (const name of column.pages) {
            const f = allFiles.find(f => f.basename === name);
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