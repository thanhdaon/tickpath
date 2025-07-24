import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";
import { fieldContext, formContext } from "~/components/form/context";

const TextField = lazy(() => import("~/components/form/field-text"));
const SubmitButton = lazy(() => import("~/components/form/submit-button"));

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
