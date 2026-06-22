"use client";

import { Checkbox } from "@/components/ui/checkbox";

import {
    EntityListAction,
    EntityListColumn,
} from "./types";

type Props<T> = {
    item: T;

    columns: EntityListColumn<T>[];

    actions?: EntityListAction<T>[];

    selectable: boolean;

    selected: boolean;

    gridTemplateColumns: string;

    actionsWidth?: string;

    onClick?: () => void;

    onToggle?: () => void;
};

export function EntityListRow<T>({
                                     item,
                                     columns,
                                     actions = [],
                                     selectable,
                                     selected,
                                     gridTemplateColumns,
                                     actionsWidth,
                                     onClick,
                                     onToggle,
                                 }: Props<T>) {
    return (
        <div
            onClick={onClick}
            className={`
        flex
        items-stretch

        rounded-xl
        border

        pr-3
        pl-0
        py-0

        shadow-sm
        transition-all

        select-none

        ${onClick ? "cursor-pointer" : ""}

        ${
                selected
                    ? `
              border-blue-300
              bg-blue-50
              shadow-blue-100
            `
                    : `
              border-zinc-200
              bg-white
              hover:bg-zinc-50
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
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle?.();
                    }}
                >
                    <Checkbox
                        checked={selected}
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

          py-3
        "
            >
                {columns.map((column) => (
                    <div
                        key={String(column.key)}
                        className={column.cellClassName}
                    >
                        {column.render(item)}
                    </div>
                ))}
            </div>

            {actions.length > 0 && (
                <div
                    className="
            ml-3

            flex
            shrink-0

            items-center
            justify-end

            gap-2
          "
                    style={{
                        width: actionsWidth,
                    }}
                >
                    {actions.map((action) => (
                        <div
                            key={action.key}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            {action.render(item)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}