"use client";

import React, { useEffect } from "react";

export interface SidebarProps {
    children?: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    side?: "left" | "right";
}

const Sidebar: React.FC<SidebarProps> = ({ children, isOpen = false, onClose, side = "left" }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <div
            className={`fixed top-0 ${side === "left" ? "left-0" : "right-0"} h-full w-64 
            bg-gray-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out 
            ${isOpen ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full"}`}
        >
            <button onClick={onClose} className="absolute top-2 right-2 text-white text-lg">
                ×
            </button>
            <div className="p-4">{children}</div>
        </div>
    );
};

export default Sidebar;
