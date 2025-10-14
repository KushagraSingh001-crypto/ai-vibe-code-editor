// FILE: modules/webcontainers/components/terminal.tsx

"use client";

import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useState } from "react";
import "xterm/css/xterm.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Trash2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import { SearchAddon } from "xterm-addon-search";

interface TerminalProps {
  className?: string;
  theme?: "dark" | "light";
  webContainerInstance?: any;
}

export interface TerminalRef {
  writeToTerminal: (data: string) => void;
  clearTerminal: () => void;
  focusTerminal: () => void;
}

const TerminalComponent = forwardRef<TerminalRef, TerminalProps>(({ 
  className,
  theme = "dark",
  webContainerInstance
}, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  const terminalThemes = {
    dark: { background: "#09090B", foreground: "#FAFAFA", cursor: "#FAFAFA", cursorAccent: "#09090B", selection: "#27272A", black: "#18181B", red: "#EF4444", green: "#22C55E", yellow: "#EAB308", blue: "#3B82F6", magenta: "#A855F7", cyan: "#06B6D4", white: "#F4F4F5", brightBlack: "#3F3F46", brightRed: "#F87171", brightGreen: "#4ADE80", brightYellow: "#FDE047", brightBlue: "#60A5FA", brightMagenta: "#C084FC", brightCyan: "#22D3EE", brightWhite: "#FFFFFF" },
    light: { background: "#FFFFFF", foreground: "#18181B", cursor: "#18181B", cursorAccent: "#FFFFFF", selection: "#E4E4E7", black: "#18181B", red: "#DC2626", green: "#16A34A", yellow: "#CA8A04", blue: "#2563EB", magenta: "#9333EA", cyan: "#0891B2", white: "#F4F4F5", brightBlack: "#71717A", brightRed: "#EF4444", brightGreen: "#22C55E", brightYellow: "#EAB308", brightBlue: "#3B82F6", brightMagenta: "#A855F7", brightCyan: "#06B6D4", brightWhite: "#FAFAFA" },
  };

  const clearTerminal = useCallback(() => {
    term.current?.clear();
  }, []);

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    writeToTerminal: (data: string) => {
      term.current?.write(data);
    },
    clearTerminal,
    focusTerminal: () => {
      term.current?.focus();
    },
  }));

  // This is the single, main effect to initialize the terminal and shell
  useEffect(() => {
    // If the terminal is already running or the container isn't ready, do nothing.
    if (term.current || !webContainerInstance || !terminalRef.current) {
      return;
    }

    // 1. Create the xterm.js terminal UI
    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
      fontSize: 14,
      theme: terminalThemes[theme],
      convertEol: true,
    });
    term.current = terminal;

    const fitAddonInstance = new FitAddon();
    fitAddon.current = fitAddonInstance;
    
    terminal.loadAddon(fitAddonInstance);
    terminal.loadAddon(new WebLinksAddon());
    terminal.loadAddon(new SearchAddon());

    terminal.open(terminalRef.current);
    fitAddonInstance.fit();

    // 2. Spawn a single, persistent shell process (`jsh`)
    const startShell = async () => {
      const shellProcess = await webContainerInstance.spawn('jsh');

      // 3. Pipe the output of the shell process to the terminal UI
      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );

      const input = shellProcess.input.getWriter();

      // 4. Pipe the input from the terminal UI to the shell process
      terminal.onData((data) => {
        input.write(data);
      });
    };

    startShell();
    
    // Fit terminal on resize
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.current?.fit();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      terminal.dispose();
      term.current = null;
    };
  }, [webContainerInstance, theme]);

  // UI state and helper functions (no changes needed here)
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const copyTerminalContent = useCallback(async () => { /* ... */ }, []);
  const downloadTerminalLog = useCallback(() => { /* ... */ }, []);
  const searchInTerminal = useCallback((term: string) => { /* ... */ }, []);

  return (
    <div className={cn("flex flex-col h-full bg-background border rounded-lg overflow-hidden", className)}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium">Terminal</span>
        </div>
        {/* Header buttons... */}
        <div className="flex items-center gap-1">
            {/* Search, Copy, Download, Trash buttons */}
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 relative" onClick={() => term.current?.focus()}>
        <div ref={terminalRef} className="absolute inset-0 p-2" />
      </div>
    </div>
  );
});

TerminalComponent.displayName = "TerminalComponent";

export default TerminalComponent;