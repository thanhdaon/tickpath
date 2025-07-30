import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DiscIcon, GalleryVerticalEnd } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "~/components/form/form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { signIn } from "~/lib/auth-client";

export const Route = createFileRoute("/_auth/signin")({
  component: SigninPage,
});

function SigninPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Tick Path
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in with your Discord account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <SigninWithDiscord />
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <SigninForm />
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

function SigninWithDiscord() {
  function onClick() {
    signIn
      .social({
        provider: "discord",
        callbackURL: "/issues",
      })
      .catch((error) => {
        toast.error(error.message, { description: "Please try again" });
      });
  }

  return (
    <Button variant="outline" className="cursor-pointer" onClick={onClick}>
      <DiscIcon />
      Sign in with Discord
    </Button>
  );
}

const FormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function SigninForm() {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: FormSchema,
    },
    onSubmit: async ({ value }) => {
      await signinWithEmail(value);
    },
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    form.handleSubmit();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <form.AppField
        name="email"
        children={(f) => <f.TextField label="Email" type="email" />}
      />
      <form.AppField
        name="password"
        children={(f) => <f.TextField label="Password" type="password" />}
      />
      <form.AppForm>
        <form.SubmitButton label="Sign in" className="cursor-pointer" />
      </form.AppForm>
    </form>
  );
}

async function signinWithEmail(values: z.infer<typeof FormSchema>) {
  const { error } = await signIn.email({
    email: values.email,
    password: values.password,
    callbackURL: "/issues",
  });

  if (error) {
    toast.error(error.message, { description: "Please try again" });
  }
}
