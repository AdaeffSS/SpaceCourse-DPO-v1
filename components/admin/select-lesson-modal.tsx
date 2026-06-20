"use client";

import {
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Lesson = {
  id: string;

  title: string;

  modulesCount: number;

  createdAt: string;
  updatedAt: string;
};

type Props = {
  open: boolean;

  onClose: () => void;

  selectedIds: string[];

  onSelect: (
      lesson: Lesson
  ) => void;
};

export function SelectLessonModal({
                                    open,
                                    onClose,
                                    selectedIds,
                                    onSelect,
                                  }: Props) {
  const [lessons, setLessons] =
      useState<Lesson[]>([]);

  const [loading, setLoading] =
      useState(false);

  const [search, setSearch] =
      useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    loadLessons();
  }, [open, search]);

  async function loadLessons() {
    try {
      setLoading(true);

      const params =
          new URLSearchParams();

      if (search) {
        params.append(
            "search",
            search
        );
      }

      const data =
          await api<Lesson[]>(
              `/lessons?${params.toString()}`
          );

      setLessons(data);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
      <div
          className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/40
                p-6
            "
      >
        <div
            className="
                    w-full max-w-4xl
                    rounded-3xl
                    bg-white
                    p-8
                "
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-zinc-950">
              Добавление уроков
            </h2>

            <Button
                variant="outline"
                onClick={onClose}
            >
              Закрыть
            </Button>
          </div>

          <input
              value={search}
              onChange={(e) =>
                  setSearch(
                      e.target.value
                  )
              }
              placeholder="Поиск урока..."
              className="
                        mt-6
                        h-11
                        w-full
                        rounded-xl
                        border border-zinc-200
                        px-4
                    "
          />

          <div className="mt-6 max-h-[550px] overflow-y-auto space-y-3">
            {loading && (
                <div className="text-zinc-500">
                  Загрузка...
                </div>
            )}

            {!loading &&
                lessons.length === 0 && (
                    <div className="text-zinc-500">
                      Уроки не найдены
                    </div>
                )}

            {!loading &&
                lessons.map(
                    (
                        lesson
                    ) => {
                      const selected =
                          selectedIds.includes(
                              lesson.id
                          );

                      return (
                          <div
                              key={
                                lesson.id
                              }
                              className="
                                            flex
                                            items-center
                                            justify-between
                                            rounded-2xl
                                            border border-zinc-200
                                            p-4
                                        "
                          >
                            <div>
                              <div className="font-medium text-zinc-950">
                                {
                                  lesson.title
                                }
                              </div>

                              <div className="mt-1 text-sm text-zinc-500">
                                Используется в{" "}
                                {
                                  lesson.modulesCount
                                }{" "}
                                модулях
                              </div>
                            </div>

                            <Button
                                disabled={
                                  selected
                                }
                                onClick={() =>
                                    onSelect(
                                        lesson
                                    )
                                }
                            >
                              {selected
                                  ? "Добавлен"
                                  : "Добавить"}
                            </Button>
                          </div>
                      );
                    }
                )}
          </div>
        </div>
      </div>
  );
}