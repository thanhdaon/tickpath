import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent } from "react";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "~/components/form/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { signUp } from "~/lib/auth-client";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
            <CardDescription>
              Sign up with your Apple or Google account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <div className="text-center text-sm mt-6">
              Already have an account?{" "}
              <Link to="/signin" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const FormSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

function SignupForm() {
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: FormSchema,
    },
    onSubmit: async ({ value }) => {
      await signupWithEmail(value);
      navigate({ to: "/signin" });
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
        name="name"
        children={(f) => <f.TextField label="Name" />}
      />
      <form.AppField
        name="password"
        children={(f) => <f.TextField label="Password" type="password" />}
      />
      <form.AppField
        name="confirmPassword"
        children={(f) => (
          <f.TextField label="Confirm Password" type="password" />
        )}
      />
      <form.AppForm>
        <form.SubmitButton label="Sign up" className="cursor-pointer" />
      </form.AppForm>
    </form>
  );
}

async function signupWithEmail(values: z.infer<typeof FormSchema>) {
  const { data, error } = await signUp.email({
    email: values.email,
    name: values.name,
    password: values.password,
  });

  if (error) {
    console.error(error);
    toast.error(error.message);
  }

  if (data) {
    toast.success("Account created successfully", {
      description: `Please check your email ${data.user.email} for verification`,
    });
  }
}
