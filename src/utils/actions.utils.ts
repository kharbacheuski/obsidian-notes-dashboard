import { Notice } from "obsidian";
import { CURRENT_LOCALE } from "src/locale";

const actions = {
    column: {
        create: function (fm: DashboardFrontmatter, name: string): boolean {
            const trimmedName = name.trim();
            if (!trimmedName) return false;
            
            fm.columns ??= [];
            if (!fm.columns.some(c => c.name === trimmedName)) {
                fm.columns.push({ name: trimmedName, pages: [] });
                return true;
            }
            else {
                new Notice(CURRENT_LOCALE.failedColumnAlreadyExist)
            }
            return false;
        },
        remove: function(fm: DashboardFrontmatter, name: string) {
            fm.columns = fm.columns?.filter(c => c.name !== name) ?? [];
        }
    },
    card: {
        create: function (fm: DashboardFrontmatter, columnName: string, page: string): boolean {
            const col = fm.columns?.find(c => c.name === columnName);
            if (!col) return false;

            col.pages ??= [];
            if (!col.pages.includes(page)) {
                col.pages.push(page);
                return true;
            }
            else {
                new Notice(CURRENT_LOCALE.failedCardAlreadyExist)
            }

            return false;
        },
        remove: function (fm: DashboardFrontmatter, columnName: string, page: string) {
            const col = fm.columns?.find(c => c.name === columnName);
            if (!col?.pages) return;

            col.pages = col.pages.filter(p => p !== page);
        }
    }
}

export default actions