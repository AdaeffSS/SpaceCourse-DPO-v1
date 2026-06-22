export type SearchResult<T> = {
    items: T[];

    meta: {
        total: number;

        page: number;

        pageSize: number;

        totalPages: number;
    };
};