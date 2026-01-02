"use client";
import React from 'react';
import Link from 'next/link';
import {Search, Command, Github} from 'lucide-react';
import useKeyboardShortcut from "@/hooks/useKeyboardShortcut";

const Navbar = ({onSearchOpen, onLogoClick, onSearchClose}) => {
    useKeyboardShortcut({
        "Meta+M": onSearchOpen,
        "Ctrl+M": onSearchOpen,
        "Escape": onSearchClose,
    });

    const GITHUB_REPO_URL = "https://github.com/wendtpiotr/letterboxd-rating-website";

    return (
        <nav
            className="fixed top-0 w-full z-100 flex justify-between items-center px-12 py-6 backdrop-blur-md bg-[#050505]/40 border-b border-white/5 transform-gpu">
            <div className="flex items-center gap-10">
                <Link
                    href="/"
                    className="text-xl font-medium tracking-widest flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={onLogoClick}
                >
                    MOOV<span className="opacity-40 ml-1">CRITIC</span>
                </Link>
            </div>

            <div className="flex items-center gap-8">
                <div
                    onClick={onSearchOpen}
                    className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/30 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group w-72 shadow-lg"
                >
                    <Search size={14} className="group-hover:text-white transition-colors"/>
                    <span className="text-[11px] tracking-wider select-none">Search Repository...</span>
                    <div
                        className="ml-auto flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Command size={10}/> <span className="text-[9px]">M</span>
                    </div>
                </div>

                <Link
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View Source on GitHub"
                    className="relative group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                >
                    <Github size={18} strokeWidth={1.5}/>

                    {/* Tooltip hint */}
                    <span
                        className="absolute -bottom-10 right-0 scale-0 group-hover:scale-100 transition-transform origin-top-right bg-white text-black text-[9px] font-bold tracking-[0.2em] px-2 py-1 rounded-sm uppercase whitespace-nowrap pointer-events-none">
                        View Code
                    </span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;