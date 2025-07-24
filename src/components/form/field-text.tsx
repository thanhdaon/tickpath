import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "~/components/form/context";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface TextFieldProps {
  label: string;
  type?: "text" | "email" | "password";
}

export default function TextField({ label, type = "text" }: TextFieldProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid gap-3">
      <Label htmlFor={label}>{label}</Label>
      <div className="grid gap-1">
        <Input
          id={label}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          type={type}
        />
        <div className="text-red-500 text-xs text-right">
          {errors.map((error, index) => (
            <span key={error.code + index}>{error.message}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
