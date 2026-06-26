import { CoursePlan } from "./course-plan";

export type Course = {
    id: string;
    title: string;
    description?: string;
    type: "ATC" | "PRP";
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;

    modulesCount: number;
    enrollmentsCount: number;
    plansCount: number;

    coursePlans?: CoursePlan[];

    _count?: {
        modules: number;
        enrollments: number;
    };
};
