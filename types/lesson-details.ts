export type LessonDetails = {
    id: string;

    title: string;

    content: string;

    files: {
        id: string;

        originalName: string;

        mimeType: string;

        sizeBytes: number;
    }[];

    modules: {
        id: string;

        title: string;

        status:
            | "DRAFT"
            | "ACTIVE"
            | "INACTIVE";

        order: number;
    }[];

    modulesCount: number;

    createdAt: string;
    updatedAt: string;
};