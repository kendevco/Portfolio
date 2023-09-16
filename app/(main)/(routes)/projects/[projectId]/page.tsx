import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ProjectIdPageProps {
  params: {
    projectId: string;
  }
};

const ProjectIdPage = async ({
  params
}: ProjectIdPageProps) => {

  const profile = await currentProfile();

  // if (!profile) {
  //   return redirectToSignIn();
  // }

  const project = await db.project.findUnique({
    where: {
      id: params.projectId,
    },
  })

}
 
export default ProjectIdPage;