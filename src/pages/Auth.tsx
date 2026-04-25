import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { BRAND_NAME } from "@/lib/brand";

const emailSchema = z.string().trim().email("Invalid email").max(255);
const passwordSchema = z.string().min(6, "Min 6 characters").max(72);
const nameSchema = z.string().trim().min(1, "Name required").max(100);

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = `Sign In | ${BRAND_NAME}`;
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(fd.get("email"));
    const password = passwordSchema.safeParse(fd.get("password"));
    if (!email.success) return toast({ title: "Invalid email", variant: "destructive" });
    if (!password.success) return toast({ title: password.error.errors[0].message, variant: "destructive" });

    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.data, password: password.data });
    setBusy(false);
    if (error) return toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    toast({ title: "Welcome back!" });
    navigate("/");
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = nameSchema.safeParse(fd.get("name"));
    const email = emailSchema.safeParse(fd.get("email"));
    const password = passwordSchema.safeParse(fd.get("password"));
    if (!name.success) return toast({ title: name.error.errors[0].message, variant: "destructive" });
    if (!email.success) return toast({ title: "Invalid email", variant: "destructive" });
    if (!password.success) return toast({ title: password.error.errors[0].message, variant: "destructive" });

    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.data, password: password.data,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { display_name: name.data } },
    });
    setBusy(false);
    if (error) return toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    toast({ title: "Account created!", description: "You're signed in." });
    navigate("/");
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-16 max-w-md">
        <div className="text-center mb-10">
          <p className="text-gold-deep tracking-[0.3em] text-xs uppercase mb-3">Welcome</p>
          <h1 className="font-serif text-4xl text-primary">Saanvi Account</h1>
          <p className="text-muted-foreground mt-2 text-sm">Save favorites, leave reviews & shop seamlessly.</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div><Label htmlFor="se">Email</Label><Input id="se" name="email" type="email" required maxLength={255} /></div>
              <div><Label htmlFor="sp">Password</Label><Input id="sp" name="password" type="password" required minLength={6} maxLength={72} /></div>
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in..." : "Sign In"}</Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div><Label htmlFor="un">Full Name</Label><Input id="un" name="name" required maxLength={100} /></div>
              <div><Label htmlFor="ue">Email</Label><Input id="ue" name="email" type="email" required maxLength={255} /></div>
              <div><Label htmlFor="up">Password</Label><Input id="up" name="password" type="password" required minLength={6} maxLength={72} /></div>
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating..." : "Create Account"}</Button>
            </form>
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
}
