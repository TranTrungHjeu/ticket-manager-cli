import { TicketService } from "../../src/services/ticketService";
import { JsonStorage } from "../../src/storage/jsonStorage";
import { Ticket } from "../../src/models/ticket";

// 1. Mock module JsonStorage
jest.mock("../../src/storage/jsonStorage");

describe("Ticket Service", () => {
  let ticketService: TicketService;
  let mockStorageInstance: any;

  beforeEach(() => {
    // Xóa các mock cũ trước mỗi bài test
    jest.clearAllMocks();

    // 2. Tạo mock của JsonStorage
    mockStorageInstance = {
      load: jest.fn().mockReturnValue([]), // Giả lập đọc file ban đầu trả về mảng rỗng
      save: jest.fn(), // Giả lập hàm lưu file
    };

    // Khi khởi tạo JsonStorage, trả về bản mock này
    (JsonStorage as jest.Mock).mockImplementation(() => mockStorageInstance);

    // 3. Khởi tạo Service
    ticketService = new TicketService("./fake-path.json");
  });

  it("should create a new ticket and save it to storage", () => {
    // Gọi hàm create
    const newTicket = ticketService.create(
      "Fix login bug",
      "User cannot login",
      "high",
      ["bug"],
    );

    // Assert: Kiểm tra xem ticket trả về có đúng chuẩn Model không
    expect(newTicket).toBeInstanceOf(Ticket);
    expect(newTicket.title).toBe("Fix login bug");
    expect(newTicket.status).toBe("open"); // Mặc định phải là open

    // Kiểm tra xem Service có gọi hàm save của Storage không?
    expect(mockStorageInstance.save).toHaveBeenCalledTimes(1);

    // Kiểm tra xem dữ liệu đưa vào hàm save có chứa ticket vừa tạo không
    const savedData = mockStorageInstance.save.mock.calls[0][0]; // Lấy tham số đầu tiên truyền vào hàm save
    expect(savedData.length).toBe(1);
    expect(savedData[0].title).toBe("Fix login bug");
  });

  // Thêm test cho hàm show (nếu có) để kiểm tra việc tìm kiếm ticket theo ID
  it("should return the ticket when a valid ID is provided", () => {
    // Arrange: Cần tạo sẵn 1 ticket trước để có data tìm kiếm
    ticketService.create("Ticket A", "Description A", "high");

    // Act: Gọi hàm show với ID = 1 (vì đây là ticket đầu tiên được tạo)
    const foundTicket = ticketService.show(1);

    // Assert: Kiểm tra xem có tìm đúng ticket không
    expect(foundTicket).toBeDefined();
    expect(foundTicket.id).toBe(1);
    expect(foundTicket.title).toBe("Ticket A");
  });

  it("should throw an error when ticket is not found", () => {
    // Act & Assert: Tìm một ID không tồn tại và kỳ vọng nó văng ra lỗi
    expect(() => {
      ticketService.show(99);
    }).toThrow("Ticket not found");
  });
});
