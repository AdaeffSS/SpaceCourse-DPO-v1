import { LessonPage } from "@/components/admin/lesson-page";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <LessonPage id={id} />;
}
