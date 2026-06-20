import { ModuleLessonsPage } from "@/components/admin/module-lessons-page";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <ModuleLessonsPage id={id} />;
}
