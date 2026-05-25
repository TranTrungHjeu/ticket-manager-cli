import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, "Tiêu đề không được để trống").max(100, "Tiêu đề quá dài"),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"], {
    message: "Độ ưu tiên không hợp lệ (phải là low, medium, hoặc high)",
  }),
  tags: z.array(z.string()).optional(),
});

export const updateTicketStatusSchema = z.enum(["open", "in_progress", "done"], {
  message: "Trạng thái không hợp lệ (phải là open, in_progress, hoặc done)",
});
