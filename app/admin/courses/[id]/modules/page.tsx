import { CourseModulesPage } from "@/components/admin/course-modules-page";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return <CourseModulesPage id={id} />;
}
