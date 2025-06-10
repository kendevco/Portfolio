import { SignUp } from "@clerk/nextjs";

interface SignUpPageProps {
  searchParams: Promise<{
    redirect_url?: string;
  }>;
}

export default async function Page({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  
  return (
    <SignUp 
      forceRedirectUrl={params.redirect_url || "/"}
      fallbackRedirectUrl={"/"}
    />
  );
}