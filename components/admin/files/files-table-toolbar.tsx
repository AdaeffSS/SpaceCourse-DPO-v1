"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
    filesCount: number;

    selectedCount: number;

    blockedSelectedCount: number;

    deletableSelectedCount: number;

    allSelected: boolean;

    search: string;

    onSearchChange: (
        value: string,
    ) => void;

    onSelectAll: () => void;

    onClearSelection: () => void;

    onDeleteSelected: () => void;
};

export function FilesTableToolbar({
                                      filesCount,

                                      selectedCount,

                                      blockedSelectedCount,

                                      deletableSelectedCount,

                                      allSelected,

                                      search,

                                      onSearchChange,

                                      onSelectAll,
                                      onClearSelection,

                                      onDeleteSelected,
                                  }: Props) {
    return (
        <>
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />

                <input
                    className="
            h-11
            w-full
            rounded-xl
            border
            border-zinc-200
            pl-10
            pr-4
          "
                    value={search}
                    onChange={(e) =>
                        onSearchChange(
                            e.target.value,
                        )
                    }
                    placeholder="Поиск файлов"
                />
            </div>

            <div className="flex h-10 items-center justify-between">
                <div className="flex items-center gap-3">

                    <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>
              Всего файлов: {filesCount}
            </span>

                        {selectedCount > 0 && (
                            <>
                                <span>•</span>

                                <span className="font-medium text-blue-600">
                  Выбрано: {selectedCount}
                </span>
                            </>
                        )}

                        {blockedSelectedCount > 0 && (
                            <>
                                <span>•</span>

                                <span className="text-amber-600">
                  Заблокировано: {blockedSelectedCount}
                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex min-w-[180px] justify-end">
                    {selectedCount > 0 && (
                        <Button
                            variant="destructive"
                            disabled={
                                deletableSelectedCount === 0
                            }
                            onClick={onDeleteSelected}
                        >
                            Удалить (
                            {deletableSelectedCount}
                            )
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}