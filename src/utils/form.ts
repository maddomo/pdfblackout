import {
    type FieldValues,
    useForm,
    type UseFormProps,
    type UseFormReturn,
  } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { type z } from "zod";
  import { useId } from "react";
  
  export type UseZodForm<TInput extends FieldValues> = UseFormReturn<TInput> & {
    /**
     * A unique ID for this form.
     */
    id: string;
  };
  
  /**
   * This function wraps react-hook-forms useForm function in order to accomodate for a Zod schema for type safety.
   * Refer to {@link useForm} for the props.
   */
  export function useZodForm<TSchema extends z.ZodType>(
    props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
      schema: TSchema;
    }
  ) {
    const form = useForm<TSchema["_input"]>({
      ...props,
      reValidateMode: props.reValidateMode ?? "onSubmit",
      mode: props.mode ?? "onSubmit",
      resolver: zodResolver(props.schema, undefined, {
        // This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
        raw: true,
      }),
    }) as UseZodForm<TSchema["_input"]>;
  
    form.id = useId();
  
    return form;
  }