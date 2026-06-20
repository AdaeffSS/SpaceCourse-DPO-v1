"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";

import { LessonDetails } from "@/types/lesson-details";

type Props = {
  id: string;
};

export function LessonPage({ id }: Props) {
  const [lesson, setLesson] = useState<LessonDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  useEffect(() => {
    loadLesson();
  }, [id]);

  async function loadLesson() {
    try {
      const data = await api<LessonDetails>(`/lessons/${id}`);

      setLesson(data);

      setTitle(data.title);

      setContent(data.content);
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
        }),
      });

      await loadLesson();
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!lesson) {
    return <div>Урок не найден</div>;
  }

  return (
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
            <label className="text-sm font-medium text-zinc-900">Контент</label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="
                                mt-2
                                min-h-[500px]
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
        <h2 className="text-xl font-semibold text-zinc-950">Файлы</h2>

        <div className="mt-6 space-y-3">
          {lesson.files.length === 0 && (
            <div className="text-zinc-500">Нет файлов</div>
          )}

          {lesson.files.map((file) => (
            <div
              key={file.id}
              className="
                                    rounded-2xl
                                    border
                                    border-zinc-200
                                    p-4
                                "
            >
              {file.originalName}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-zinc-950">
          Используется в модулях
        </h2>

        <div className="mt-6 space-y-3">
          {lesson.modules.map((module) => (
            <div
              key={module.id}
              className="
                                    rounded-2xl
                                    border
                                    border-zinc-200
                                    p-4
                                "
            >
              {module.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
