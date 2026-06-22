"use client";

import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";

import { api } from "@/lib/api";

import { FileItem } from "@/types/file";

import { FilesDropzone } from "./files-dropzone";

import { SearchResult } from "@/types/api/search-result";

import { SearchInput } from "@/components/shared/search-input/search-input";
import { EntityBrowserPagination } from "@/components/shared/entity-browser/entity-browser-pagination";

import { FilesEntityList } from "./files-entity-list";
import {Button} from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState("");


  const [search, setSearch] =
      useState("");

  const [page, setPage] =
      useState(1);

  const [total, setTotal] =
      useState(0);

  const [totalPages, setTotalPages] =
      useState(1);

  const [selectedIds, setSelectedIds] =
      useState<string[]>([]);

  const [sortField, setSortField] =
      useState<keyof FileItem>(
          "createdAt",
      );

  const [sortOrder, setSortOrder] =
      useState<"asc" | "desc">(
          "desc",
      );


  const [deleteResult, setDeleteResult] = useState<{
    deletedCount: number;

    blockedFiles: {
      id: string;
      originalName: string;
      lessonId: string;
      lessonTitle: string;
    }[];
  } | null>(null);

  useEffect(() => {
    loadFiles();
  }, [
    page,
    search,
    sortField,
    sortOrder,
  ]);

  async function loadFiles() {
    try {
      setLoading(true);

      const result =
          await api<
              SearchResult<FileItem>
          >("/files/search", {
            method: "POST",

            body: JSON.stringify({
              page,
              pageSize: 20,

              search,

              sortField,
              sortOrder,
            }),
          });

      setFiles(result.items);

      setTotal(
          result.meta.total,
      );

      setTotalPages(
          result.meta.totalPages,
      );

      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  }

  const selectedFiles =
      files.filter((file) =>
          selectedIds.includes(file.id),
      );

  function toggleSort(
      field: keyof FileItem,
  ) {
    setPage(1);

    if (sortField === field) {
      setSortOrder(
          sortOrder === "asc"
              ? "desc"
              : "asc",
      );

      return;
    }

    setSortField(field);

    setSortOrder("desc");
  }

  const deletableSelectedCount = selectedFiles.filter(
      (file) => file.lessonsCount === 0,
  ).length;

  const blockedSelectedCount = selectedFiles.filter(
      (file) => file.lessonsCount > 0,
  ).length;

  async function deleteSelected() {
    if (!selectedIds.length) {
      return;
    }

    if (!confirm(`Удалить ${selectedIds.length} файлов?`)) {
      return;
    }

    const result = await api<{
      success: boolean;

      deletedCount: number;

      blockedCount: number;

      blockedFiles: {
        id: string;
        originalName: string;
        lessonId: string;
        lessonTitle: string;
      }[];
    }>("/files", {
      method: "DELETE",

      body: JSON.stringify({
        ids: selectedIds,
      }),
    });

    setDeleteResult({
      deletedCount: result.deletedCount,

      blockedFiles: result.blockedFiles,
    });

    await loadFiles();
  }

  async function deleteOne(id: string) {
    if (!confirm("Удалить файл?")) {
      return;
    }

    await api(`/files/${id}`, {
      method: "DELETE",
    });

    await loadFiles();
  }

  async function downloadFile(id: string, name: string) {
    const token = document.cookie
      .split("; ")
      .find((r) => r.startsWith("token="))
      ?.split("=")[1];

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/files/${id}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = name;

    document.body.appendChild(a);

    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  async function uploadFiles(fileList: FileList) {
    try {
      setUploading(true);

      const files = Array.from(fileList);

      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Загрузка ${i + 1} из ${files.length}`);

        const form = new FormData();

        form.append("file", files[i]);

        await api("/files", {
          method: "POST",
          body: form,
        });
      }

      setUploadProgress("");

      await loadFiles();
    } finally {
      setUploading(false);
    }
  }

  return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <h1 className="text-4xl font-semibold">
            Файлы
          </h1>
        </div>

        {deleteResult && (
            <div
                className="
          rounded-xl
          border
          border-zinc-200
          bg-white
          p-4
        "
            >
              <div className="font-medium">
                Удалено файлов: {deleteResult.deletedCount}
              </div>

              {deleteResult.blockedFiles.length > 0 && (
                  <>
                    <div className="mt-3 font-medium text-amber-700">
                      Не удалось удалить:
                    </div>

                    <div className="mt-2 space-y-2">
                      {deleteResult.blockedFiles.map((file) => (
                          <div
                              key={file.id}
                              className="
                    rounded-lg
                    border
                    border-amber-200
                    bg-amber-50
                    p-3
                  "
                          >
                            <div className="font-medium">
                              {file.originalName}
                            </div>

                            <div className="text-sm text-zinc-600">
                              Используется в уроке:
                              {" "}
                              {file.lessonTitle}
                            </div>
                          </div>
                      ))}
                    </div>
                  </>
              )}
            </div>
        )}

        <FilesDropzone
            uploading={uploading}
            progress={uploadProgress}
            onUpload={uploadFiles}
        />

        <SearchInput
            placeholder="Поиск файлов..."
            onChange={(value) => {
              setPage(1);
              setSearch(value);
            }}
        />

        <div
            className="
    flex
    items-center
    justify-between
    gap-4
  "
        >
          <div
              className="
      flex
      items-center
      gap-2
      text-sm
    "
          >
    <span>
      Всего файлов:{" "}
      <strong>{total}</strong>
    </span>

            {selectedIds.length > 0 && (
                <>
        <span className="text-zinc-400">
          •
        </span>

                  <span className="text-blue-600">
          Выбрано:{" "}
                    <strong>
            {selectedIds.length}
          </strong>
        </span>
                </>
            )}
          </div>

          {selectedIds.length > 0 && (
              <Button
                  variant="destructive"
                  onClick={deleteSelected}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить выбранные
              </Button>
          )}
        </div>

        <FilesEntityList
            files={files}
            loading={loading}
            selectedIds={selectedIds}
            sortField={sortField}
            sortOrder={sortOrder}
            onSelectionChange={
              setSelectedIds
            }
            onSort={toggleSort}
            onDownload={downloadFile}
            onDelete={deleteOne}
        />

        <EntityBrowserPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
        />
      </div>
  );
}