import { Ticket, Priority, Status } from "../models/ticket";
import { JsonStorage } from "../storage/jsonStorage";

export interface TicketFilters {
  status?: Status;
  priority?: Priority;
  tags?: string;
}

export class TicketService {
  private storage: JsonStorage;
  private tickets: Ticket[];

  constructor(storageOrPath: any) {
    if (typeof storageOrPath === "string") {
      // Đáp ứng bài test create & show (nhận string)
      this.storage = new JsonStorage(storageOrPath);
    } else {
      // Đáp ứng bài test list (nhận object mockStorage)
      this.storage = storageOrPath;
    }

    // Bây giờ this.storage chắc chắn là 1 object có hàm load()
    this.tickets = this.storage.load<Ticket>();
  }

  public create(
    title: string,
    description: string,
    priority: Priority,
    tags?: string[],
  ): Ticket {
    const nextId =
      this.tickets.length > 0
        ? Math.max(...this.tickets.map((t) => t.id)) + 1
        : 1;

    const newTicket = new Ticket(nextId, title, description, priority, tags);

    this.tickets.push(newTicket);
    this.storage.save(this.tickets);

    return newTicket;
  }

  public show(id: number): Ticket {
    this.tickets = this.storage.load<Ticket>();
    return this.findTicketById(id);
  }

  public list(filters?: TicketFilters): Ticket[] {
    const currentTickets = this.storage.load<Ticket>();
    if (!filters) {
      return currentTickets;
    }

    return currentTickets.filter((ticket) => {
      let isMatch = true;

      if (filters.status && ticket.status !== filters.status) {
        isMatch = false;
      }
      if (filters.priority && ticket.priority !== filters.priority) {
        isMatch = false;
      }
      if (
        filters.tags &&
        (!ticket.tags || !ticket.tags.includes(filters.tags))
      ) {
        isMatch = false;
      }

      return isMatch;
    });
  }
  public update(id: number, newStatus: Status): Ticket {
    this.tickets = this.storage.load<Ticket>();
    const foundTicket = this.findTicketById(id);
    if (!foundTicket) {
      throw new Error("Ticket not found");
    }
    foundTicket.status = newStatus;
    this.storage.save(this.tickets);
    return foundTicket;
  }
  // Hàm dùng nội bộ trong Service
  private findTicketById(id: number): Ticket {
    const foundTicket = this.tickets.find((t) => t.id === id);
    if (!foundTicket) {
      throw new Error("Ticket not found");
    }
    return foundTicket;
  }
}
