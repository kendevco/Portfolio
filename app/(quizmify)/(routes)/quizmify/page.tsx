import SigninControl from "@/components/quizmify/DetailsDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  
  return (

    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Welcome to Quizmify 🔥!</CardTitle>
          <CardDescription>
            Quizmify is a platform for creating quizzes using AI!. Get started
            by loggin in below!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SigninControl />
        </CardContent>
      </Card>
    </div>
  );
}
