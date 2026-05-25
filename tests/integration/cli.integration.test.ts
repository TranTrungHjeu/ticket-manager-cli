import { execSync } from "child_process";
import fs from "fs";
import path from "path";

describe("CLI Integration Tests", () => {
  const ticketFilePath = path.join(__dirname, "../../tickets.json");
  const backupFilePath = path.join(__dirname, "../../tickets.json.bak");

  // Sao lưu file tickets.json thật nếu đang có sẵn
  beforeAll(() => {
    if (fs.existsSync(ticketFilePath)) {
      fs.renameSync(ticketFilePath, backupFilePath);
    }
  });

  // Khôi phục lại file tickets.json sau khi chạy xong tests
  afterAll(() => {
    if (fs.existsSync(ticketFilePath)) {
      fs.unlinkSync(ticketFilePath);
    }
    if (fs.existsSync(backupFilePath)) {
      fs.renameSync(backupFilePath, ticketFilePath);
    }
  });

  // Tạo môi trường sạch trước mỗi test case
  beforeEach(() => {
    if (fs.existsSync(ticketFilePath)) {
      fs.unlinkSync(ticketFilePath);
    }
  });

  const runCLI = (args: string): string => {
    try {
      // Chạy CLI qua ts-node
      return execSync(`npx ts-node src/main.ts ${args}`, {
        encoding: "utf-8",
        stdio: "pipe",
      });
    } catch (error: any) {
      // Trả về output lỗi của CLI để kiểm tra nội dung in ra
      return error.stdout || error.stderr || error.message;
    }
  };

  it("should create a ticket successfully via CLI", () => {
    const output = runCLI("create -t 'Integration Task' -d 'Desc' -p high");
    expect(output).toContain("Tạo vé thành công!");
    expect(output).toContain("ID của vé là: 1");

    expect(fs.existsSync(ticketFilePath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(ticketFilePath, "utf-8"));
    expect(data.length).toBe(1);
    expect(data[0].title).toBe("Integration Task");
  });

  it("should list tickets successfully via CLI", () => {
    runCLI("create -t 'Task 1' -d 'Desc 1' -p low");
    runCLI("create -t 'Task 2' -d 'Desc 2' -p high");

    const output = runCLI("list");
    expect(output).toContain("Task 1");
    expect(output).toContain("Task 2");
  });

  it("should show ticket details successfully via CLI", () => {
    runCLI("create -t 'Unique Task' -d 'Unique Desc' -p medium");

    const output = runCLI("show 1");
    expect(output).toContain("CHI TIẾT VÉ #1");
    expect(output).toContain("Tiêu đề    : Unique Task");
    expect(output).toContain("Mô tả      : Unique Desc");
  });

  it("should update ticket status successfully via CLI", () => {
    runCLI("create -t 'Update Task' -d 'Desc' -p low");

    const output = runCLI("update 1 in_progress");
    expect(output).toContain("Cập nhật trạng thái vé #1 thành công!");
    expect(output).toContain("Trạng thái mới: in_progress");
  });

  it("should print validation error clean output when creating a ticket with empty title", () => {
    const output = runCLI("create -t '' -d 'Desc' -p high");
    expect(output).toContain("Lỗi");
    expect(output).not.toContain("ZodError");
    expect(output).not.toContain("at "); // Không được có stack trace
  });

  it("should print clean error when tickets.json is corrupted", () => {
    fs.writeFileSync(ticketFilePath, "{ invalid json }", "utf-8");

    const output = runCLI("list");
    expect(output).toContain("Lỗi");
    expect(output).toContain("bị hỏng");
    expect(output).not.toContain("at "); // Không được có stack trace
  });
});
