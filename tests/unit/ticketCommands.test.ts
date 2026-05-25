import { TicketService } from "../../src/services/ticketService";
import { Ticket } from "../../src/models/ticket";
import {
  createTicketCommand,
  showTicketCommand,
  listTicketCommand,
  updateTicketCommand,
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
  describe("CLI Commands - List", () => {
    let consoleSpy: jest.SpyInstance;
    let mockServiceInstance: any;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      // Giả lập Service trả về mảng 2 vé khi gọi hàm list()
      mockServiceInstance = {
        list: jest
          .fn()
          .mockReturnValue([
            new Ticket(1, "Lỗi giao diện", "Nút bấm bị lệch", "low", ["ui"]),
            new Ticket(2, "Lỗi máy chủ", "Không kết nối được DB", "high", [
              "bug",
            ]),
          ]),
      };
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should call ticketService.list and log all returned tickets", () => {
      listTicketCommand(mockServiceInstance, {});

      expect(mockServiceInstance.list).toHaveBeenCalledWith({});

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Lỗi giao diện");
      expect(output).toContain("Lỗi máy chủ");
    });

    it("should log a message if no tickets match the filter", () => {
      mockServiceInstance.list.mockReturnValue([]);

      listTicketCommand(mockServiceInstance, { status: "done" });

      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain("Không tìm thấy");
    });
  });
  describe("CLI Commands - Update", () => {
    let consoleSpy: jest.SpyInstance;
    let mockServiceInstance: any;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      mockServiceInstance = {
        update: jest
          .fn()
          .mockReturnValue(
            new Ticket(1, "Sửa nút Login", "Nút bị lệch", "high", ["ui"]),
          ),
      };
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should call ticketService.update and log success message", () => {
      updateTicketCommand(mockServiceInstance, 1, "in_progress" as any);

      expect(mockServiceInstance.update).toHaveBeenCalledWith(1, "in_progress");

      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain("thành công");
    });

    it("should log an error message if update fails (e.g., ticket not found)", () => {
      mockServiceInstance.update.mockImplementation(() => {
        throw new Error("Ticket not found");
      });

      updateTicketCommand(mockServiceInstance, 99, "done" as any);
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain("Lỗi");
      expect(consoleSpy.mock.calls[0][0]).toContain("Ticket not found");
    });
  });
});
