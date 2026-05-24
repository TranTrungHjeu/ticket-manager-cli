import { Ticket } from "../../src/models/ticket";

describe("Ticket Model", () => {
  it("should create a new ticket with correct properties and default values", () => {
    // Arrange & Act
    // Bây giờ ta chỉ cần truyền những thông tin thiết yếu
    const ticket = new Ticket(1, "Ticket 01", "Ticket 01 description", "high");

    // Assert
    expect(ticket.id).toBe(1);
    expect(ticket.title).toBe("Ticket 01");
    expect(ticket.description).toBe("Ticket 01 description");
    expect(ticket.priority).toBe("high");

    // Kiểm tra tính năng gán giá trị mặc định đã hoạt động chưa
    expect(ticket.status).toBe("open");
    expect(ticket.createdAt).toBeInstanceOf(Date);
    expect(ticket.updatedAt).toBeInstanceOf(Date);
  });
});
