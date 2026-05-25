import { TicketService } from "../services/ticketService";
import { Priority } from "../models/ticket";

export function createTicketCommand(
  ticketService: TicketService,
  title: string,
  description: string,
  priority: Priority,
  tags?: string,
): void {
  try {
    let tagsArray: string[] | undefined = undefined;
    if (tags) {
      tagsArray = tags.split(",").map((tag) => tag.trim());
    }
    const ticket = ticketService.create(
      title,
      description,
      priority,
      tagsArray,
    );
    console.log(`Tạo vé thành công! ID của vé là: ${ticket.id}`);
  } catch (error: any) {
    console.log(`Lỗi khi tạo vé: ${error.message}`);
  }
}
