import { App, TFile, Notice } from "obsidian";
import { useEffect, useRef } from "react";
import { CURRENT_LOCALE } from "src/locale";

export async function updateFrontmatter(app: App, file: TFile, updater: (fm: DashboardFrontmatter) => void): Promise<void> {
    try {
        await app.fileManager.processFrontMatter(file, fm => {
            updater(fm)
        });
    } catch (error) {
        console.error(CURRENT_LOCALE.failedUpdateFm, error);
        new Notice(CURRENT_LOCALE.failedUpdateFm);
    }
}

export const getFrontmatter = (app: App) => {
    const cache = app.metadataCache.getFileCache(app.workspace.getActiveFile()!);
    return structuredClone(cache?.frontmatter ?? {});
}