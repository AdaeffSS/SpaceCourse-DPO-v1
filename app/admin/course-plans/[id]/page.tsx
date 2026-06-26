import { PlanPage } from "@/components/admin/course-plans/plan-page";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function Page({
                                       params,
                                   }: Props) {
    const { id } = await params;

    return <PlanPage id={id} />;
}