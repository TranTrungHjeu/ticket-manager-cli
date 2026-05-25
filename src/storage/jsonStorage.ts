import fs from "fs";

export class JsonStorage {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public save<T>(data: T[]): void {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      fs.writeFileSync(this.filePath, jsonString, "utf-8");
    } catch (error: any) {
      throw new Error(`Không thể ghi dữ liệu xuống tệp tin: ${error.message}`);
    }
  }

  public load<T>(): T[] {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }

    try {
      const fileContent = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(fileContent);
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        throw new Error(
          "Cơ sở dữ liệu tệp tin JSON bị hỏng (Invalid JSON structure)!",
        );
      }
      throw new Error(`Không thể đọc dữ liệu từ tệp tin: ${error.message}`);
    }
  }
}
