import { Command } from "commander";
import { JsonStorage } from "./storage/jsonStorage";
import { TicketService } from "./services/ticketService";
import {
  createTicketCommand,
  showTicketCommand,
  listTicketCommand,
  updateTicketCommand,
} from "./commands/ticketCommands";
import { Priority, Status } from "./models/ticket";

try {
  const storage = new JsonStorage("./tickets.json");
  const ticketService = new TicketService(storage);

  const program = new Command();

  program
    .name("ticket-cli")
    .description("Ứng dụng quản lý Ticket trên Terminal")
    .version("1.0.0");

  // --- Lệnh CREATE ---
  program
    .command("create")
    .description("Tạo một ticket mới")
    .requiredOption("-t, --title <string>", "Tiêu đề của ticket")
    .requiredOption("-d, --desc <string>", "Mô tả chi tiết")
    .requiredOption("-p, --priority <level>", "Độ ưu tiên (low, medium, high)")
    .option("--tags <string>", "Các thẻ tag cách nhau bằng dấu phẩy (vd: bug,ui)")
    .action((options) => {
      createTicketCommand(
        ticketService,
        options.title,
        options.desc,
        options.priority as Priority,
        options.tags,
      );
    });

  // --- Lệnh SHOW ---
  program
    .command("show")
    .description("Xem chi tiết một ticket theo ID")
    .argument("<id>", "ID của ticket", parseInt)
    .action((id: number) => {
      showTicketCommand(ticketService, id);
    });

  // --- Lệnh LIST ---
  program
    .command("list")
    .description("Xem danh sách ticket")
    .option(
      "-s, --status <status>",
      "Lọc theo trạng thái (open, in_progress, done)",
    )
    .option(
      "-p, --priority <priority>",
      "Lọc theo độ ưu tiên (low, medium, high)",
    )
    .option("--tags <tag>", "Lọc theo tag")
    .action((options) => {
      listTicketCommand(ticketService, {
        status: options.status as Status,
        priority: options.priority as Priority,
        tags: options.tags,
      });
    });

  // --- Lệnh UPDATE ---
  program
    .command("update")
    .description("Cập nhật trạng thái của ticket")
    .argument("<id>", "ID của ticket", parseInt)
    .argument("<status>", "Trạng thái mới (open, in_progress, done)")
    .action((id: number, status: string) => {
      updateTicketCommand(ticketService, id, status as Status);
    });

  program.parse(process.argv);
} catch (error: any) {
  console.log(`Lỗi: ${error.message}`);
  process.exit(1);
}
