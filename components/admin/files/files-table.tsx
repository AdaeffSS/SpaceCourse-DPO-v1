"use client";

import {
  Download,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { FileItem } from "@/types/file";
import {Checkbox} from "@/components/ui/checkbox";

type SelectedMap = Record<string, boolean>;

type FilesTableProps = {
  files: FileItem[];
  loading: boolean;

  selected: SelectedMap;

  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;

  onDownload: (
      id: string,
      name: string
  ) => Promise<void>;

  onDelete: (
      id: string
  ) => Promise<void>;
};

function getFileType(fileName: string) {
  return (
      fileName
          .split(".")
          .pop()
          ?.toUpperCase() || "FILE"
  );
}

function getTypeClass(type: string) {
  switch (type) {
    case "PDF":
      return "bg-red-50 text-red-700 border-red-200";

    case "DOC":
    case "DOCX":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "XLS":
    case "XLSX":
      return "bg-green-50 text-green-700 border-green-200";

    case "PNG":
    case "JPG":
    case "JPEG":
    case "WEBP":
      return "bg-violet-50 text-violet-700 border-violet-200";

    case "ZIP":
    case "RAR":
      return "bg-amber-50 text-amber-700 border-amber-200";

    default:
      return "bg-zinc-50 text-zinc-700 border-zinc-200";
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} Б`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} КБ`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
  }

  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} ГБ`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
      "ru-RU",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
  );
}

export function FilesTable({
                             files,
                             loading,

                             selected,

                             onSelect,
                             onSelectAll,
                             onClearSelection,

                             onDownload,
                             onDelete,
                           }: FilesTableProps) {
  const selectedIds = Object.keys(
      selected
  ).filter((id) => selected[id]);

  const allSelected =
      files.length > 0 &&
      selectedIds.length === files.length;

  if (loading) {
    return (
        <div className="rounded-2xl border bg-white p-8 text-center">
          Загрузка...
        </div>
    );
  }

  return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-3 px-2 py-2">
            <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) =>
                    checked
                        ? onSelectAll()
                        : onClearSelection()
                }
            />

            <div className="flex items-center gap-2 text-sm text-zinc-500">
  <span>
    Всего файлов: {files.length}
  </span>

                {selectedIds.length > 0 && (
                    <>
                        <span>•</span>

                        <span className="font-medium text-blue-600">
        Выбрано: {selectedIds.length}
      </span>
                    </>
                )}
            </div>
        </div>

        {files.map((file) => {
          const type = getFileType(
              file.originalName
          );

          return (
              <div
                  key={file.id}
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
                      selected[file.id]
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
                  <Checkbox
                      className="pointer-events-none"
                      checked={!!selected[file.id]}
                      onCheckedChange={() =>
                          onSelect(file.id)
                      }
                  />

                <span
                    className={`
                inline-flex
                shrink-0
                items-center
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

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {file.originalName}
                  </div>
                </div>

                <div className="w-24 text-sm text-zinc-500">
                  {formatSize(
                      file.sizeBytes
                  )}
                </div>

                <div className="w-32 text-sm text-zinc-500">
                  {file.lessonsCount > 0
                      ? `${file.lessonsCount} уроков`
                      : "Не используется"}
                </div>

                <div className="w-28 text-sm text-zinc-500">
                  {formatDate(
                      file.createdAt
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                          e.stopPropagation();

                          onDownload(
                              file.id,
                              file.originalName
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
        })}
      </div>
  );
}