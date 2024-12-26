import { redirect } from "next/navigation";
import { authOptions } from "./lib/auth";
import { getServerSession } from "next-auth";
export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    console.log("came to /");
    redirect("/dashboard");
  } else {
    redirect("/api/auth/signin");
  }
}
