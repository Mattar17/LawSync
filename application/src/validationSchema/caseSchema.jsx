import { z } from "zod";

const arabicNameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
const numbersOnlyRegex = /^[0-9]+$/;

export const caseSchema = z.object({
  case_number: z
    .string()
    .min(1, "رقم القضية مطلوب")
    .regex(numbersOnlyRegex, "رقم القضية يجب أن يحتوي على أرقام فقط"),

  case_year: z
    .string()
    .min(4, "سنة القضية مطلوبة")
    .regex(numbersOnlyRegex, "سنة القضية يجب أن تكون أرقام فقط"),

  client_name: z
    .string()
    .min(3, "اسم العميل يجب ألا يقل عن 3 أحرف")
    .regex(arabicNameRegex, "اسم العميل يجب أن يحتوي على حروف فقط بدون أرقام"),

  client_role: z.string().min(1, "يرجى اختيار دور العميل"),

  client_opponent_name: z
    .string()
    .min(3, "اسم الخصم يجب ألا يقل عن 3 أحرف")
    .regex(arabicNameRegex, "اسم الخصم يجب أن يحتوي على حروف فقط بدون أرقام"),

  client_opponent_role: z.string().min(1, "يرجى اختيار دور الخصم"),

  client_national_id: z
    .string()
    .length(14, "الرقم القومي يجب أن يتكون من 14 رقمًا")
    .regex(numbersOnlyRegex, "الرقم القومي يجب أن يحتوي على أرقام فقط"),

  client_opponent_national_id: z
    .string()
    .length(14, "الرقم القومي للخصم يجب أن يتكون من 14 رقمًا")
    .regex(numbersOnlyRegex, "الرقم القومي للخصم يجب أن يحتوي على أرقام فقط"),

  latest_court_session_date: z.string().refine((date) => {
    if (!date) return true;

    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, "تاريخ الجلسة الماضية غير صحيح"),

  next_court_session_date: z.string().refine((date) => {
    if (!date) return true;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, "تاريخ الجلسة القادمة غير صحيح"),

  case_status: z
    .string()
    .min(3, "يرجى إدخال وصف لحالة القضية, 4 حروف علي الأقل!")
    .refine(
      (val) => val.trim().split(/\s+/).length <= 100,
      "حالة القضية يجب ألا تتجاوز 100 كلمة",
    ),
});
