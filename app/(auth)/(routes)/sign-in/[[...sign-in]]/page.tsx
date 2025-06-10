import { SignIn } from "@clerk/nextjs";

interface SignInPageProps {
  searchParams: Promise<{
    redirect_url?: string;
  }>;
}

export default async function Page({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  
  return (
    <SignIn 
      forceRedirectUrl={params.redirect_url || "/"}
      fallbackRedirectUrl={"/"}
    />
  );
}