import { fs, vol } from "memfs";
import { JsonStorage } from "../../src/storage/jsonStorage";

// Mock module 'fs' bằng 'memfs'
jest.mock("fs", () => require("memfs").fs);

describe("JSON Storage Layer", () => {
  const testFilePath = "/test-data.json";

  beforeEach(() => {
    // Reset đĩa ảo về trạng thái sạch trước mỗi test case
    vol.reset();
  });

  it("should save an array of data and load it back correctly", () => {
    const storage = new JsonStorage(testFilePath);
    const mockData = [
      { id: 1, title: "Test Ticket" },
      { id: 2, title: "Another Ticket" },
    ];

    storage.save(mockData);
    const loadedData = storage.load();

    expect(fs.existsSync(testFilePath)).toBe(true);
    expect(loadedData).toEqual(mockData);
  });

  it("should return an empty array if the file does not exist", () => {
    const storage = new JsonStorage("/non-existent.json");
    const loadedData = storage.load();
    expect(loadedData).toEqual([]);
  });

  it("should throw a custom error when loading a corrupted JSON file", () => {
    // Ghi file lỗi cú pháp vào bộ nhớ RAM ảo
    vol.writeFileSync(testFilePath, "{ invalid json }");
    const storage = new JsonStorage(testFilePath);

    expect(() => {
      storage.load();
    }).toThrow("Cơ sở dữ liệu tệp tin JSON bị hỏng (Invalid JSON structure)!");
  });
});
