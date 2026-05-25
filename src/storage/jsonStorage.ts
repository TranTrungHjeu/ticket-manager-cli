import fs from "fs";
export class JsonStorage {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public save<T>(data: T[]): void {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(this.filePath, jsonString, "utf-8");
  }
  public load<T>(): T[] {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }

    const fileContent = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(fileContent);
  }
}
