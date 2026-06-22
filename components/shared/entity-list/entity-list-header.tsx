"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

import { EntityListColumn } from "./types";

type Props<T> = {
  columns: EntityListColumn<T>[];

  selectable: boolean;

  allSelected: boolean;

  gridTemplateColumns: string;

  actionsWidth?: string;

  sortField?: keyof T;

  sortOrder?: "asc" | "desc";

  onToggleAll: () => void;

  onSort?: (field: keyof T) => void;
};

export function EntityListHeader<T>({
  columns,
  selectable,
  allSelected,
  gridTemplateColumns,
  actionsWidth,
  sortField,
  sortOrder,
  onToggleAll,
  onSort,
}: Props<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const element = sentinelRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-px" />

      <div
        className={`
          sticky
          top-0
          z-20

          select-none

          flex
          items-stretch

          border
          border-zinc-300

          bg-zinc-100/95
          backdrop-blur-sm

          pr-3
          pl-0
          py-0

          text-xs
          font-semibold
          uppercase
          tracking-wide

          text-zinc-600

          transition-all
          duration-200

          ${
            stuck
              ? `
                rounded-t-none
                rounded-b-xl
              `
              : `
                rounded-xl
              `
          }
        `}
      >
        {selectable && (
          <div
            className="
              group

              flex
              shrink-0

              cursor-pointer

              items-center
              justify-center

              px-4
              py-4
            "
            onClick={onToggleAll}
          >
            <Checkbox
              checked={allSelected}
              className="
                pointer-events-none

                group-hover:border-blue-400
              "
            />
          </div>
        )}

        <div
          style={{
            gridTemplateColumns,
          }}
          className="
            grid
            flex-1

            items-center

            gap-3

            py-4
          "
        >
          {columns.map((column) => {
            const isSorted = column.key === sortField;

            return (
                <div
                    key={String(column.key)}
                    className={column.headerClassName}
                >
                  <div
                      className={`
      relative
      inline-flex
      items-center

      ${
                          column.sortable
                              ? `
            cursor-pointer
            hover:text-zinc-900
          `
                              : ""
                      }
    `}
                      onClick={() => {
                        if (!column.sortable) {
                          return;
                        }

                        onSort?.(column.key);
                      }}
                  >
                    {column.title}

                    {isSorted && (
                        <span
                            className="
          absolute
          left-full
          ml-1

          top-1/2
          -translate-y-1/2
        "
                        >
        <ChevronDown
            className={`
            h-3.5
            w-3.5

            transition-transform

            ${
                sortOrder === "asc"
                    ? "rotate-180"
                    : ""
            }
          `}
        />
      </span>
                    )}
                  </div>
                </div>
            );
          })}
        </div>

        {actionsWidth && (
          <div
            className="
              ml-3
              shrink-0
            "
            style={{
              width: actionsWidth,
            }}
          />
        )}
      </div>
    </>
  );
}
