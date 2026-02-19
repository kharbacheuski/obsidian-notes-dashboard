import { useEffect, useRef } from "react";
import { TextComponent } from "obsidian";

interface Props {
    placeholder?: string;
    autoFocus?: boolean;
    onCommit: (value: string) => void;
    onCancel?: () => void;
}

export default function TextInput({
    placeholder,
    autoFocus = false,
    onCommit,
    onCancel,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textComponentRef = useRef<TextComponent | null>(null);
    const committedRef = useRef(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const text = new TextComponent(containerRef.current);
        textComponentRef.current = text;

        text.inputEl.placeholder = placeholder ?? "";
        text.inputEl.autocomplete = "off";

        if (autoFocus) {
            setTimeout(() => text.inputEl.focus(), 0);
        }

        const commit = () => {
            if (committedRef.current) return;
            committedRef.current = true;

            const value = text.getValue().trim();
            onCommit(value);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
                committedRef.current = true;
                onCancel?.();
            }
        };

        text.inputEl.addEventListener("keydown", handleKeyDown);
        text.inputEl.addEventListener("blur", commit);

        return () => {
            text.inputEl.removeEventListener("keydown", handleKeyDown);
            text.inputEl.removeEventListener("blur", commit);
            textComponentRef.current = null;
        };
    }, [placeholder, autoFocus, onCommit, onCancel]);

    return <div ref={containerRef} />;
}
