"use client";

import { useEffect, useState } from "react";

import { Search, X } from "lucide-react";

import { useDebounce } from "@/hooks/use-debounce";

type Props = {
    onChange: (
        value: string,
    ) => void;

    placeholder?: string;

    debounceMs?: number;
};

export function SearchInput({
                                onChange,
                                placeholder = "Поиск...",
                                debounceMs = 500,
                            }: Props) {
    const [value, setValue] =
        useState("");

    const debouncedValue =
        useDebounce(
            value,
            debounceMs,
        );

    useEffect(() => {
        onChange(debouncedValue);
    }, [debouncedValue]);

    return (
        <div className="relative">
            <Search
                className="
          absolute
          left-4
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          text-zinc-400
        "
            />

            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) =>
                    setValue(
                        e.target.value,
                    )
                }
                className="
          h-11
          w-full

          rounded-xl
          border
          border-zinc-300

          bg-white

          pl-10
          pr-10

          text-sm

          outline-none

          transition-colors

          focus:border-blue-500
        "
            />

            {value && (
                <button
                    type="button"
                    onClick={() =>
                        setValue("")
                    }
                    className="
            absolute
            right-3
            top-1/2

            -translate-y-1/2

            text-zinc-400

            hover:text-zinc-700
          "
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}