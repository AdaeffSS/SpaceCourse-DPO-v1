import { ModulePage } from "@/components/admin/module-page";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return <ModulePage id={id} />;
}
