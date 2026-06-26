export type CoursePlan = {
    id: string;
    price: number;
    hours: number;
    durationDays: number;
    type: "ATC" | "PRP";
    coursesCount?: number;
    enrollmentsCount?: number;
    createdAt: string;
    updatedAt: string;
};

export type CoursePlanModuleHour = {
    id: string;
    moduleId: string;
    durationValue: number;
    module: {
        id: string;
        title: string;
    };
};

export type CoursePlanRelationDetails = {
    courseId: string;
    planId: string;
    testHours: number;
    plan: CoursePlan;
    moduleHours: CoursePlanModuleHour[];
};
