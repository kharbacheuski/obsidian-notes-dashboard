import { useEffect, useRef } from "react";
import { App, TFile } from "obsidian";
import { updateFrontmatter } from "./frontmatter.utils";

export function useKanbanPersistence(
    app: App,
    sourceFile: TFile,
    columns: KanbanColumn[]
) {
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(async () => {
            await updateFrontmatter(app, sourceFile, fm => {
                fm.columns = columns.map(col => ({
                    name: col.name,
                    pages: col.pages.map(p => p.basename)
                }));
            });
        }, 400);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [columns, app, sourceFile]);
}
