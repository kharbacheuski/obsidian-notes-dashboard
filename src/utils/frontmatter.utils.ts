import { App, TFile, Notice } from "obsidian";
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