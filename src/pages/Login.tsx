
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Login = () => (
  <main className="flex min-h-[80vh] items-center justify-center bg-background">
    <Card className="max-w-sm w-full shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Sign in to StudyDeck</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-muted-foreground">
              Email
            </label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-muted-foreground">
              Password
            </label>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full mt-4">Sign In</Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link className="text-primary underline hover:opacity-80" to="/signup">
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  </main>
);

export default Login;
