import React, { useEffect, useRef } from "react";
import { setIcon } from "obsidian";

interface Props {
    icon: string;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
}

export default function IconButton({
    icon,
    onClick,
    className = "",
}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            setIcon(ref.current, icon);
        }
    }, [icon]);

    return (
        <div
            ref={ref}
            className={`icon-btn ${className}`}
            onClick={(e) => {
                e.stopPropagation();
                onClick(e);
            }}
        />
    );
}
