export type CoursePlan = {
    id: string;

    price: number;
    hours: number;
    durationDays: number;

    coursesCount: number;

    createdAt: string;
    updatedAt: string;
};

export type CoursePlanDetails = {
    id: string;

    price: number;
    hours: number;
    durationDays: number;

    courses: {
        id: string;
        title: string;
    }[];

    createdAt: string;
    updatedAt: string;
};