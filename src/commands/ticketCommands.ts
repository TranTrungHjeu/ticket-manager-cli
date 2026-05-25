import { TicketService, TicketFilters } from "../services/ticketService";
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

export function showTicketCommand(
  ticketService: TicketService,
  id: number,
): void {
  try {
    const ticket = ticketService.show(id);
    const ticketInfo =
      `--- CHI TIẾT VÉ #${ticket.id} ---\n` +
      `Tiêu đề    : ${ticket.title}\n` +
      `Mô tả      : ${ticket.description}\n` +
      `Trạng thái : ${ticket.status}\n` +
      `Ưu tiên    : ${ticket.priority}\n` +
      `Tags       : ${ticket.tags?.join(", ") || "Không có"}`;

    console.log(ticketInfo);
  } catch (error: any) {
    console.log(`Lỗi: ${error.message}`);
  }
}
export function listTicketCommand(
  ticketService: TicketService,
  filters: TicketFilters,
): void {
  try {
    const tickets = ticketService.list(filters);

    if (tickets.length === 0) {
      console.log("Không tìm thấy vé nào phù hợp.");
      return;
    }

    // Refactor: Dùng map và join thay vì forEach và let
    const header = "--- DANH SÁCH VÉ MỚI NHẤT ---\n";
    const body = tickets
      .map(
        (t) =>
          `[#${t.id}] ${t.title} | Cấp độ: ${t.priority} | Trạng thái: ${t.status}`,
      )
      .join("\n");

    console.log(header + body);
  } catch (error: any) {
    console.log(`Lỗi: ${error.message}`);
  }
}
