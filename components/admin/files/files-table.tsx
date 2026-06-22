"use client";

import { Checkbox } from "@/components/ui/checkbox";

import { FileItem } from "@/types/file";

import { FilesTableToolbar } from "./files-table-toolbar";
import { FilesTableRow } from "./files-table-row";

type SelectedMap = Record<string, boolean>;

export const FILE_TABLE_COLUMNS = {
  checkbox: "w-5",
  type: "w-12",
  size: "w-24",
  usage: "w-32",
  date: "w-28",
  actions: "w-20",
};

type FilesTableProps = {
  files: FileItem[];
  loading: boolean;

  search: string;
  onSearchChange: (value: string) => void;

  selected: SelectedMap;

  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;

  onDeleteSelected: () => void;

  blockedSelectedCount: number;
  deletableSelectedCount: number;

  onDownload: (id: string, name: string) => Promise<void>;

  onDelete: (id: string) => Promise<void>;
};

export function FilesTable({
  files,
  loading,

  search,
  onSearchChange,

  selected,

  onSelect,
  onSelectAll,
  onClearSelection,

  onDeleteSelected,

  blockedSelectedCount,
  deletableSelectedCount,

  onDownload,
  onDelete,
}: FilesTableProps) {
  const selectedIds = Object.keys(selected).filter((id) => selected[id]);

  const allSelected = files.length > 0 && selectedIds.length === files.length;

  return (
    <div className="relative">
      {loading && (
        <div
          className="
            absolute
            inset-0
            z-50

            flex
            items-center
            justify-center

            rounded-xl

            bg-white/50
            backdrop-blur-[1px]
          "
        >
          <div
            className="
              h-8
              w-8
              animate-spin
              rounded-full
              border-4
              border-zinc-300
              border-t-blue-600
            "
          />
        </div>
      )}

      <div
        className={`
          space-y-3
          transition-opacity
          duration-200

          ${loading ? "opacity-50" : "opacity-100"}
        `}
      >
        <FilesTableToolbar
          filesCount={files.length}
          selectedCount={selectedIds.length}
          blockedSelectedCount={blockedSelectedCount}
          deletableSelectedCount={deletableSelectedCount}
          allSelected={allSelected}
          search={search}
          onSearchChange={onSearchChange}
          onSelectAll={onSelectAll}
          onClearSelection={onClearSelection}
          onDeleteSelected={onDeleteSelected}
        />

        <div
          className="
            sticky
            top-0
            z-20

            flex
            items-center
            gap-4

            rounded-b-xl
            rounded-t-none

            border
            border-zinc-300

            bg-zinc-100

            px-4
            py-3

            text-xs
            font-semibold
            uppercase
            tracking-wide

            text-zinc-600
          "
        >
          <div className={FILE_TABLE_COLUMNS.checkbox}>
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) =>
                checked ? onSelectAll() : onClearSelection()
              }
            />
          </div>

          <div
            className={`
              ${FILE_TABLE_COLUMNS.type}
              text-center
            `}
          >
            Тип
          </div>

          <div className="min-w-0 flex-1">Название</div>

          <div className={FILE_TABLE_COLUMNS.size}>Размер</div>

          <div className={FILE_TABLE_COLUMNS.usage}>Использование</div>

          <div className={FILE_TABLE_COLUMNS.date}>Дата</div>

          <div className={FILE_TABLE_COLUMNS.actions} />
        </div>

        {files.map((file) => (
          <FilesTableRow
            key={file.id}
            file={file}
            selected={!!selected[file.id]}
            onSelect={onSelect}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
