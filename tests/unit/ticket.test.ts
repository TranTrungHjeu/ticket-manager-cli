import { Ticket } from "../../src/models/ticket";
describe("Ticket", () => {
  it("should create a ticket object", () => {
    const ticket: Ticket = {
      id: 1,
      title: "Ticket 01",
      description: "Ticket 01 description",
      status: "open",
      priority: "high",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(ticket.title).toBe("Ticket 01");
  });
});
