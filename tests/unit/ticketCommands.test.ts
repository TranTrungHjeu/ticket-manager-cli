import { TicketService } from "../../src/services/ticketService";
import { Ticket } from "../../src/models/ticket";
import {
  createTicketCommand,
  showTicketCommand,
} from "../../src/commands/ticketCommands";

jest.mock("../../src/services/ticketService");

describe("CLI Commands - Create", () => {
  let consoleSpy: jest.SpyInstance;
  let mockServiceInstance: any;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    mockServiceInstance = {
      create: jest
        .fn()
        .mockReturnValue(
          new Ticket(1, "Fix Bug", "Description", "high", ["bug"]),
        ),
    };

    (TicketService as jest.Mock).mockImplementation(() => mockServiceInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call ticketService.create and console.log the result", () => {
    createTicketCommand(
      mockServiceInstance,
      "Fix Bug",
      "Description",
      "high",
      "bug",
    );

    expect(mockServiceInstance.create).toHaveBeenCalledWith(
      "Fix Bug",
      "Description",
      "high",
      ["bug"],
    );

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain("thành công");
  });
  describe("CLI Commands - Show", () => {
    let consoleSpy: jest.SpyInstance;
    let mockServiceInstance: any;

    beforeEach(() => {
      // Vẫn "nghe lén" màn hình console
      consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      // Giả lập Service trả về 1 vé khi gọi hàm show()
      mockServiceInstance = {
        show: jest
          .fn()
          .mockReturnValue(
            new Ticket(
              1,
              "Lỗi đăng nhập",
              "Không thể login bằng Google",
              "high",
              ["bug"],
            ),
          ),
      };
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should call ticketService.show and log the ticket details", () => {
      // Act: Gọi hàm giao diện
      showTicketCommand(mockServiceInstance, 1);

      // Assert: Đảm bảo gọi đúng hàm ở tầng dưới
      expect(mockServiceInstance.show).toHaveBeenCalledWith(1);

      // Assert: Đảm bảo in ra màn hình có chứa tiêu đề của vé
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain("Lỗi đăng nhập");
    });

    it("should log an error message if ticket is not found", () => {
      // Cài đặt lại mock để ném lỗi (giả lập trường hợp nhập ID sai)
      mockServiceInstance.show.mockImplementation(() => {
        throw new Error("Ticket not found");
      });

      // Act
      showTicketCommand(mockServiceInstance, 99);

      // Assert: Đảm bảo catch được lỗi và in ra cho người dùng chữ "Lỗi"
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain("Lỗi");
      expect(consoleSpy.mock.calls[0][0]).toContain("Ticket not found");
    });
  });
});
