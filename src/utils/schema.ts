import { z } from 'zod';

const nameRegex = /^[A-Za-z]+(?:[-'][A-Za-z]+)*$/g;

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    firstName: z
      .string()
      .regex(nameRegex, "First name cant have special characters or spaces"),
    lastName: z.string().regex(nameRegex),
  });

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export const signupCompleteSchema = z.object({
    firstName: z.string().regex(nameRegex),
    lastName: z.string().regex(nameRegex),
  });

  export const pdfFormSchema = z.object({
    file: z.custom<File>(),
    whiteList: z.array(z.string()).optional(),
    blackList: z.array(z.string()).optional(),
    items: z.array(z.string()).min(1, {
      message: "You have to select at least one item.",
  }),

  });
