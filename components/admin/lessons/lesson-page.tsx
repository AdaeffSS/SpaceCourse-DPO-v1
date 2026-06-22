"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";

import { LessonDetails } from "@/types/lesson-details";
import { FileItem } from "@/types/file";

import { SelectFileModal } from "@/components/admin/lessons/modals/select-file-modal";
import Link from "next/link";

function getModuleStatus(status: string) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Активен",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };

    case "DRAFT":
      return {
        label: "Черновик",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };

    case "INACTIVE":
      return {
        label: "Неактивен",
        className: "bg-zinc-100 text-zinc-600 border-zinc-200",
      };

    default:
      return {
        label: status,
        className: "bg-zinc-100 text-zinc-600 border-zinc-200",
      };
  }
}

type Props = {
  id: string;
};

export function LessonPage({ id }: Props) {
  const [lesson, setLesson] = useState<LessonDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [selectFileOpen, setSelectFileOpen] = useState(false);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [fileIds, setFileIds] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadLesson();
  }, [id]);

  async function loadLesson() {
    try {
      const data = await api<LessonDetails>(`/lessons/${id}`);

      setLesson(data);

      setTitle(data.title);

      setContent(data.content);

      setFileIds(data.files.map((file) => file.id));
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    try {
      setSaving(true);

      await api(`/lessons/${id}`, {
        method: "PATCH",

        body: JSON.stringify({
          title,
          content,
          fileIds,
        }),
      });

      await loadLesson();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    try {
      setUploading(true);

      const uploadedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();

          formData.append("file", file);

          return api<FileItem>("/files", {
            method: "POST",
            body: formData,
          });
        }),
      );

      setFileIds((prev) => [...prev, ...uploadedFiles.map((file) => file.id)]);

      setLesson((prev) =>
        prev
          ? {
              ...prev,
              files: [
                ...prev.files,
                ...uploadedFiles.map((file) => ({
                  id: file.id,
                  originalName: file.originalName,
                  mimeType: file.mimeType,
                  sizeBytes: file.sizeBytes,
                })),
              ],
            }
          : prev,
      );
    } finally {
      event.target.value = "";

      setUploading(false);
    }
  }

  function removeFile(fileId: string) {
    setFileIds((prev) => prev.filter((id) => id !== fileId));

    setLesson((prev) =>
      prev
        ? {
            ...prev,
            files: prev.files.filter((file) => file.id !== fileId),
          }
        : prev,
    );
  }

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!lesson) {
    return <div>Урок не найден</div>;
  }

  return (
    <>
      <SelectFileModal
        open={selectFileOpen}
        onClose={() => setSelectFileOpen(false)}
        selectedIds={fileIds}
        onSelect={(file) => {
          setFileIds((prev) => [...prev, file.id]);

          setLesson((prev) =>
            prev
              ? {
                  ...prev,
                  files: [
                    ...prev.files,
                    {
                      id: file.id,
                      originalName: file.originalName,
                      mimeType: file.mimeType,
                      sizeBytes: file.sizeBytes,
                    },
                  ],
                }
              : prev,
          );
        }}
      />

      <div className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
            Урок
          </h1>

          <p className="text-zinc-600">Редактирование содержимого урока.</p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-zinc-900">
                Название
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
                  mt-2
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-zinc-200
                  px-4
                "
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-900">
                Контент
              </label>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="
                  mt-2
                  min-h-[120px]
                  w-full
                  rounded-xl
                  border
                  border-zinc-200
                  p-4
                "
              />
            </div>

            <Button onClick={save} disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-950">Файлы</h2>

            <div className="flex gap-3">
              <Button
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? "Загрузка..." : "Загрузить файлы"}
              </Button>

              <Button variant="outline" onClick={() => setSelectFileOpen(true)}>
                Добавить из существующих
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />

          <div className="mt-6 space-y-3 mb-6">
            {lesson.files.length === 0 && (
              <div className="text-zinc-500">Нет прикреплённых файлов</div>
            )}

            {lesson.files.map((file) => (
              <div
                key={file.id}
                className="
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-zinc-200
                    p-4
                  "
              >
                <div>
                  <div className="font-medium">{file.originalName}</div>

                  <div className="text-sm text-zinc-500">{file.mimeType}</div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                >
                  Убрать
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-zinc-950">
            Используется в модулях
          </h2>

          <div className="mt-6 space-y-3">
            {lesson.modules.map((module) => {
              const moduleStatus = getModuleStatus(module.status);

              return (
                <Link
                  key={module.id}
                  href={`/admin/modules/${module.id}`}
                  className="
        flex
        items-center
        justify-between

        rounded-2xl
        border
        border-zinc-200

        p-4

        transition-colors
        hover:bg-zinc-50
      "
                >
                  <div>
                    <div className="font-medium text-zinc-950">
                      {module.title.charAt(0).toUpperCase() +
                        module.title.slice(1)}
                    </div>
                  </div>

                  <div
                    className={`
          rounded-full
          border
          px-3
          py-1

          text-xs
          font-medium

          ${moduleStatus.className}
        `}
                  >
                    {moduleStatus.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
