import { App, SuggestModal, TFile } from "obsidian";
import { CURRENT_LOCALE } from "src/locale";

export class AddNoteModal extends SuggestModal<TFile> {
    constructor(app: App, private onSelect: (file: TFile | null) => void) {
        super(app);
        this.setPlaceholder(CURRENT_LOCALE.searchNotePlaceholder);
    }

    getSuggestions(query: string): TFile[] {
        const queryLower = query.toLowerCase();
        return this.app.vault
            .getFiles()
            .filter(f => {
                return f.basename.toLowerCase().includes(queryLower) ||
                    f.path.toLowerCase().includes(queryLower);
            })
    }

    renderSuggestion(file: TFile, el: HTMLElement) {
        const container = el.createDiv({ cls: "suggestion-content" });
        container.createDiv({ text: file.basename, cls: "suggestion-title" });
        container.createDiv({ text: file.path, cls: "suggestion-note" });
    }

    onChooseSuggestion(file: TFile) {
        this.onSelect(file);
    }
}