export type Module = {
    id: string;

    title: string;
    description: string | null;

    status:
        | "DRAFT"
        | "ACTIVE"
        | "INACTIVE";

    completionType:
        | "MANUAL"
        | "TEST";

    finalTestId: string | null;

    createdAt: string;
    updatedAt: string;

    _count?: {
        lessons: number;
    };
};

export type ModuleDetails =
    {
        id: string;

        title: string;
        description: string | null;

        status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';

        completionType: 'MANUAL' | 'TEST';

        finalTestId: string | null;

        finalTest: {
            id: string;
            title: string;
        } | null;

        lessons: {
            id: string;
            title: string;
            order: number;
        }[];

        lessonsCount: number;

        courses: {
            id: string;
            title: string;
        }[];

        coursesCount: number;

        createdAt: Date;
        updatedAt: Date;
    }