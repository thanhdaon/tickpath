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
import { uploadFileWithSignedUrl } from "~/lib/s3-client";
import { client } from "~/orpc/rpc-client";

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
  avatar: z.file().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

function SignupForm() {
  const navigate = useNavigate();

  const defaultValues: FormValues = {
    email: "test@test.com",
    name: "test",
    password: "test12345",
    confirmPassword: "test12345",
    avatar: undefined,
  };

  const form = useAppForm({
    defaultValues,
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
      <form.AppField name="avatar" children={(f) => <f.AvatarField />} />
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

async function signupWithEmail(values: FormValues) {
  const { data, error } = await signUp.email({
    email: values.email,
    name: values.name,
    password: values.password,
  });

  if (error) {
    toast.error(error.message);
  }

  if (data === null) {
    toast.error("Failed to create account");
    return;
  }

  await client.users.createProfile({ userId: data.user.id });

  if (values.avatar) {
    const url = await client.files.generateUserAvatarUploadUrl({
      avatar: values.avatar,
    });

    await uploadFileWithSignedUrl(url.signedUrl, values.avatar);

    const [file] = await client.files.add({
      files: [
        {
          key: url.key,
          bucket: url.bucket,
          filename: values.avatar.name,
          mimeType: values.avatar.type,
          size: values.avatar.size,
          uploadedByUserId: data.user.id,
        },
      ],
    });

    await client.users.updateProfileAvatar({
      userId: data.user.id,
      avatarFileId: file.id,
    });
  }

  toast.success("Account created successfully", {
    description: `Please check your email ${data.user.email} for verification`,
  });
}
