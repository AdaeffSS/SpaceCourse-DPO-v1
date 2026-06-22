import { ReactNode } from "react";

export type EntityBrowserAction = {
    key: string;

    component: ReactNode;
};

export type EntityBrowserStat = {
    label: string;

    value: string | number;

    className?: string;
};