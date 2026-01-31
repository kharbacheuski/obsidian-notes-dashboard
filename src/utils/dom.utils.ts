import { setIcon } from "obsidian";

const createIconButton = (container: HTMLElement, icon: string, onClick: (e: MouseEvent) => void): HTMLDivElement => {
    const btn = container.createDiv({ cls: "icon-btn" });
    setIcon(btn, icon);
    btn.onclick = (e) => {
        e.stopPropagation()
        onClick(e)
    };

    return btn
}

export {createIconButton}