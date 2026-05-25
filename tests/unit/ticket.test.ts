import { Ticket } from "../../src/models/ticket";

describe("Ticket Model", () => {
  it("should create a new ticket with an empty tags array by default", () => {
    // Không truyền tags
    const ticket = new Ticket(1, "Ticket 01", "Ticket 01 description", "high");

    expect(ticket.tags).toEqual([]);
  });

  it("should create a new ticket with provided tags", () => {
    // Truyền mảng tags
    const ticket = new Ticket(2, "Ticket 02", "Ticket 02 description", "high", [
      "bug",
      "urgent",
    ]);

    expect(ticket.id).toBe(2);
    expect(ticket.tags).toEqual(["bug", "urgent"]);
  });
});
