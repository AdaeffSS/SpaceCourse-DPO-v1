export type Course = {
    id: string;

    title: string;
    description?: string;

    type: "ATC" | "PRP";

    isPublished: boolean;

    createdAt: string;
    updatedAt: string;

    plan: {
        id: string;
        price: number;
        hours: number;
        durationDays: number;
    };

    _count: {
        modules: number;
        enrollments: number;
    };
};