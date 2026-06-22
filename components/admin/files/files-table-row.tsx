"use client";

import { Download, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { FileItem } from "@/types/file";

import { FILE_TABLE_COLUMNS } from "./files-table";

import {
    formatDate,
    formatSize,
    getFileType,
    getTypeClass,
} from "./files-table-utils";

type Props = {
    file: FileItem;

    selected: boolean;

    onSelect: (id: string) => void;

    onDownload: (
        id: string,
        name: string,
    ) => Promise<void>;

    onDelete: (
        id: string,
    ) => Promise<void>;
};

export function FilesTableRow({
                                  file,
                                  selected,
                                  onSelect,
                                  onDownload,
                                  onDelete,
                              }: Props) {
    const type = getFileType(
        file.originalName,
    );

    return (
        <div
            onClick={() => onSelect(file.id)}
            className={`
        flex
        cursor-pointer
        items-center
        gap-4
        rounded-xl
        border
        px-4
        py-3
        shadow-sm
        transition-all

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
            <div className={FILE_TABLE_COLUMNS.checkbox}>
                <Checkbox
                    className="pointer-events-none"
                    checked={selected}
                />
            </div>

            <div
                className={`
    ${FILE_TABLE_COLUMNS.type}
    flex
    justify-center
  `}
            >
  <span
      className={`
      inline-flex
      w-12
      justify-center
      rounded-md
      border
      px-2
      py-0.5
      text-xs
      font-medium
      ${getTypeClass(type)}
    `}
  >
    {type}
  </span>
            </div>

            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                    {file.originalName}
                </div>
            </div>

            <div
                className={`
          ${FILE_TABLE_COLUMNS.size}
          text-sm
          text-zinc-500
        `}
            >
                {formatSize(
                    file.sizeBytes,
                )}
            </div>

            <div
                className={`
          ${FILE_TABLE_COLUMNS.usage}
          text-sm
          text-zinc-500
        `}
            >
                {file.lessonsCount > 0
                    ? `${file.lessonsCount} уроков`
                    : "Не используется"}
            </div>

            <div
                className={`
          ${FILE_TABLE_COLUMNS.date}
          text-sm
          text-zinc-500
        `}
            >
                {formatDate(
                    file.createdAt,
                )}
            </div>

            <div
                className={`
          ${FILE_TABLE_COLUMNS.actions}
          flex
          gap-2
        `}
            >
                <Button
                    size="icon"
                    variant="outline"
                    onClick={(e) => {
                        e.stopPropagation();

                        onDownload(
                            file.id,
                            file.originalName,
                        );
                    }}
                >
                    <Download className="h-4 w-4" />
                </Button>

                <Button
                    size="icon"
                    variant="outline"
                    disabled={
                        file.lessonsCount > 0
                    }
                    onClick={(e) => {
                        e.stopPropagation();

                        onDelete(file.id);
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}