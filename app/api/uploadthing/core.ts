import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Added by Antonio 1:53:38 implementing auth from vendor provided example.
const handleAuth = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId: userId };
}


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    serverImage: f({image: { maxFileSize: "4MB", maxFileCount: 1   }})
        .middleware(async () => await handleAuth())
        .onUploadComplete(() => {}),
    messageFile: f(["image", "pdf"])
        .middleware(async () => await handleAuth())
        .onUploadComplete(() => {}),

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;