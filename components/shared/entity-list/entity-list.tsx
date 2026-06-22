"use client";

import { EntityListHeader } from "./entity-list-header";
import { EntityListRow } from "./entity-list-row";
import { EntityListProps } from "./types";

export function EntityList<T>({
                                  data,
                                  columns,

                                  actions = [],

                                  selectable = false,

                                  selectedIds = [],

                                  loading = false,

                                  sortField,
                                  sortOrder,
                                  onSort,

                                  getRowId,

                                  onRowClick,

                                  onSelectionChange,
                              }: EntityListProps<T>) {
    const allSelected =
        data.length > 0 &&
        selectedIds.length === data.length;

    const gridTemplateColumns = columns
        .map((column) => column.width)
        .join(" ");

    const actionsWidth =
        actions.length > 0
            ? "96px"
            : undefined;

    const toggleAll = () => {
        if (!onSelectionChange) {
            return;
        }

        if (allSelected) {
            onSelectionChange([]);

            return;
        }

        onSelectionChange(
            data.map(getRowId),
        );
    };

    const toggleItem = (
        id: string,
    ) => {
        if (!onSelectionChange) {
            return;
        }

        const isSelected =
            selectedIds.includes(id);

        if (isSelected) {
            onSelectionChange(
                selectedIds.filter(
                    (itemId) =>
                        itemId !== id,
                ),
            );

            return;
        }

        onSelectionChange([
            ...selectedIds,
            id,
        ]);
    };

    return (
        <div
            className={`
        space-y-3

        transition-opacity
        duration-200

        ${
                loading
                    ? "opacity-50"
                    : "opacity-100"
            }
      `}
        >
            <EntityListHeader
                columns={columns}
                selectable={selectable}
                allSelected={allSelected}
                onToggleAll={toggleAll}
                gridTemplateColumns={
                    gridTemplateColumns
                }
                actionsWidth={
                    actionsWidth
                }
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
            />

            {data.map((item) => {
                const id =
                    getRowId(item);

                return (
                    <EntityListRow
                        key={id}
                        item={item}
                        columns={columns}
                        actions={actions}
                        selectable={
                            selectable
                        }
                        selected={selectedIds.includes(
                            id,
                        )}
                        onClick={() =>
                            onRowClick?.(item)
                        }
                        onToggle={() =>
                            toggleItem(id)
                        }
                        gridTemplateColumns={
                            gridTemplateColumns
                        }
                        actionsWidth={
                            actionsWidth
                        }
                    />
                );
            })}
        </div>
    );
}