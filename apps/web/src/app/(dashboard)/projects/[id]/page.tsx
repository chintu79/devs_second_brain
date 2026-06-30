import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || (userId && project.userId !== userId)) {
    redirect("/projects");
  }

  redirect(`/projects?id=${id}`);
}
