"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { EntityBrowserAction, EntityBrowserStat } from "./types";

type Props = {
  search: string;

  onSearchChange: (value: string) => void;

  stats: EntityBrowserStat[];

  actions: EntityBrowserAction[];
};

export function EntityBrowserToolbar({
  search,
  onSearchChange,
  stats,
  actions,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          className="
            absolute
            left-4
            top-1/2

            h-5
            w-5

            -translate-y-1/2

            text-zinc-400
          "
        />

        <Input
          value={search}
          placeholder="Поиск..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            h-12
            pl-12
          "
        />
      </div>

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
            flex-wrap
            items-center
            gap-2

            text-sm
          "
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="
                  flex
                  items-center
                  gap-2
                "
            >
              {index > 0 && <span className="text-zinc-400">•</span>}

              <span className={stat.className}>
                {stat.label}: <strong>{stat.value}</strong>
              </span>
            </div>
          ))}
        </div>

        {actions.length > 0 && (
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            {actions.map((action) => (
              <div key={action.key}>{action.component}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
