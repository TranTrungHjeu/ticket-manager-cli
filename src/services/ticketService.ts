import { Ticket, Priority } from "../models/ticket";
import { JsonStorage } from "../storage/jsonStorage";

export class TicketService {
  private storage: JsonStorage;
  private tickets: Ticket[];

  constructor(filePath: string) {
    this.storage = new JsonStorage(filePath);
    this.tickets = this.storage.load<Ticket>();
  }

  public create(
    title: string,
    description: string,
    priority: Priority,
    tags?: string[],
  ): Ticket {
    // 1. Tự động tính toán ID tiếp theo (ID lớn nhất hiện tại + 1, nếu mảng rỗng thì là 1)
    const nextId =
      this.tickets.length > 0
        ? Math.max(...this.tickets.map((t) => t.id)) + 1
        : 1;

    // 2. Tạo instance Ticket mới
    const newTicket = new Ticket(nextId, title, description, priority, tags);

    // 3. Đẩy vào mảng quản lý hiện tại
    this.tickets.push(newTicket);

    // 4. Lưu toàn bộ mảng mới ghi đè xuống file JSON
    this.storage.save(this.tickets);

    return newTicket;
  }
}
