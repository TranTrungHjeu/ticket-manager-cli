import { TicketService } from "../../src/services/ticketService";
import { Ticket } from "../../src/models/ticket";
import { createTicketCommand } from "../../src/commands/ticketCommands";

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
});
