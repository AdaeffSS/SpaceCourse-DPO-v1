"use client";

import { Button } from "@/components/ui/button";

type Props = {
  page: number;

  totalPages: number;

  onPageChange: (page: number) => void;
};

export function EntityBrowserPagination({
                                          page,
                                          totalPages,
                                          onPageChange,
                                        }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  const start = Math.max(
      1,
      page - 2,
  );

  const end = Math.min(
      totalPages,
      page + 2,
  );

  for (
      let i = start;
      i <= end;
      i++
  ) {
    pages.push(i);
  }

  return (
      <div
          className="
        flex
        items-center
        justify-center

        gap-2

        pt-2
      "
      >
        <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() =>
                onPageChange(page - 1)
            }
        >
          Назад
        </Button>

        {start > 1 && (
            <>
              <Button
                  variant="outline"
                  onClick={() =>
                      onPageChange(1)
                  }
              >
                1
              </Button>

              {start > 2 && (
                  <span>...</span>
              )}
            </>
        )}

        {pages.map((p) => (
            <Button
                key={p}
                variant={
                  p === page
                      ? "default"
                      : "outline"
                }
                onClick={() =>
                    onPageChange(p)
                }
            >
              {p}
            </Button>
        ))}

        {end < totalPages && (
            <>
              {end < totalPages - 1 && (
                  <span>...</span>
              )}

              <Button
                  variant="outline"
                  onClick={() =>
                      onPageChange(
                          totalPages,
                      )
                  }
              >
                {totalPages}
              </Button>
            </>
        )}

        <Button
            variant="outline"
            disabled={
                page >= totalPages
            }
            onClick={() =>
                onPageChange(page + 1)
            }
        >
          Вперёд
        </Button>
      </div>
  );
}