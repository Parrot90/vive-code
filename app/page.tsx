import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-rose-500">
          Welcome, {session?.user?.name || "User"}!
        </h1>
        
        {session?.user?.image && (
          <div className="relative w-20 h-20 mx-auto">
            <Image
              src={session.user.image}
              alt="Profile"
              fill
              className="rounded-full object-cover"
              sizes="80px"
            />
          </div>
        )}
        
        <p className="text-gray-600">
          Email: {session?.user?.email}
        </p>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/auth/sign-in" });
        }}
      >
        <Button type="submit" variant="outline">
          Sign Out
        </Button>
      </form>
    </div>
  );
}
