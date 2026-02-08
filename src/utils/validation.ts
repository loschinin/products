import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Введите имя пользователя"),
  password: z.string().min(1, "Введите пароль"),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  title: z.string().min(1, "Введите наименование"),
  price: z.coerce.number().min(0.01, "Цена должна быть больше 0"),
  brand: z.string().optional(),
  sku: z.string().min(1, "Введите артикул"),
});

export type ProductFormData = z.infer<typeof productSchema>;
