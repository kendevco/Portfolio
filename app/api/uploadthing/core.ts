import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const user = await currentUser();
  if (!user) throw new UploadThingError("Unauthorized!");
  return { userId: user.id };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Profile/Avatar images
  profileImage: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 1 
    }
  })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[UPLOADTHING] Profile image uploaded by ${metadata.userId}:`, file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Project images
  projectImage: f({ 
    image: { 
      maxFileSize: "8MB", 
      maxFileCount: 1 
    }
  })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[UPLOADTHING] Project image uploaded by ${metadata.userId}:`, file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Home page images
  homePageImage: f({ 
    image: { 
      maxFileSize: "8MB", 
      maxFileCount: 1 
    }
  })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[UPLOADTHING] Home page image uploaded by ${metadata.userId}:`, file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // General file uploads (PDF, documents, etc.)
  generalFile: f(["image", "pdf", "text"])
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[UPLOADTHING] General file uploaded by ${metadata.userId}:`, file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Legacy support
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[UPLOADTHING] Server image uploaded by ${metadata.userId}:`, file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[UPLOADTHING] Message file uploaded by ${metadata.userId}:`, file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;