import { useStore } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { useFormContext } from "~/components/form/context";
import { Button } from "~/components/ui/button";

interface SubmitButtonProps {
  label: string;
  className?: string;
}

export default function SubmitButton({ label, className }: SubmitButtonProps) {
  const form = useFormContext();
  const { disabled, loading } = useStore(form.store, (state) => ({
    disabled: state.isSubmitting || !state.isValid || !state.isTouched,
    loading: state.isSubmitting,
  }));

  return (
    <Button disabled={disabled} className={className}>
      {label}
      {loading && <Loader2Icon className="animate-spin" />}
    </Button>
  );
}
