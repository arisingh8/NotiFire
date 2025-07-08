"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CollapserStyles } from "./styles";

interface CollapserProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function Collapser({
  title,
  children,
  defaultOpen = false,
  className = "",
}: CollapserProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={CollapserStyles.container(className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={CollapserStyles.button}
        aria-expanded={isOpen}
      >
        <span className={CollapserStyles.title}>{title}</span>
        {isOpen ? (
          <ChevronUp className={CollapserStyles.icon} />
        ) : (
          <ChevronDown className={CollapserStyles.icon} />
        )}
      </button>

      <div className={CollapserStyles.content(isOpen)}>
        <div className={CollapserStyles.innerContent}>{children}</div>
      </div>
    </div>
  );
}
