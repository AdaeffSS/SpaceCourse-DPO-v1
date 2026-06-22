import { ReactNode } from "react";

export type EntityListColumn<T> = {
  key: keyof T;

  title: string;

  width: string;

  sortable?: boolean;

  headerClassName?: string;

  cellClassName?: string;

  render: (item: T) => ReactNode;
};

export type EntityListProps<T> = {
  data: T[];

  columns: EntityListColumn<T>[];

  actions?: EntityListAction<T>[];

  selectable?: boolean;

  selectedIds?: string[];

  sortField?: keyof T;

  sortOrder?: "asc" | "desc";

  getRowId: (item: T) => string;

  onRowClick?: (item: T) => void;

  onSelectionChange?: (
      ids: string[],
  ) => void;

  onSort?: (
      field: keyof T,
  ) => void;

  loading?: boolean;
};

export type EntityListAction<T> = {
  key: string;

  render: (item: T) => ReactNode;
};