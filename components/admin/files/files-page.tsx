"use client";

import { useEffect, useState } from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";

import { FileItem } from "@/types/file";

import { FilesDropzone } from "./files-dropzone";
import { FilesTable } from "./files-table";

type SelectedMap = Record<string, boolean>;

export function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState("");

  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<SelectedMap>({});

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
  }, [search]);

  async function loadFiles() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }

      const data = await api<FileItem[]>(`/files?${params.toString()}`);

      setFiles(data);
      setSelected({});
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function selectAll() {
    const map: SelectedMap = {};

    files.forEach((file) => {
      map[file.id] = true;
    });

    setSelected(map);
  }

  function clearSelection() {
    setSelected({});
  }

  const selectedIds = Object.keys(selected).filter((id) => selected[id]);

  const selectedFiles = files.filter((file) => selected[file.id]);

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
        <h1 className="text-4xl font-semibold">Файлы</h1>

        {selectedIds.length > 0 && (
          <div className="text-right">
            <Button variant="destructive" onClick={deleteSelected}>
              Удалить ({selectedIds.length})
            </Button>

            {blockedSelectedCount > 0 && (
              <div className="mt-1 text-xs text-amber-600">
                {blockedSelectedCount} файлов используются в уроках
              </div>
            )}
          </div>
        )}
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
                    <div className="font-medium">{file.originalName}</div>

                    <div className="text-sm text-zinc-600">
                      Используется в уроке: {file.lessonTitle}
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

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4" />

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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск файлов"
        />
      </div>

      <FilesTable
        files={files}
        loading={loading}
        selected={selected}
        onSelect={toggleSelect}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onDownload={downloadFile}
        onDelete={deleteOne}
      />
    </div>
  );
}
