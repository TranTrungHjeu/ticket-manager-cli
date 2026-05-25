import fs from "fs";
import { JsonStorage } from "../../src/storage/jsonStorage";

describe("JSON Storage Layer", () => {
  const testFilePath = "./test-data.json";

  // Dọn dẹp file sau mỗi test để không làm rác project
  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it("should save an array of data and load it back correctly", () => {
    // Arrange: Khởi tạo storage với đường dẫn file test
    const storage = new JsonStorage(testFilePath);
    const mockData = [
      { id: 1, title: "Test Ticket" },
      { id: 2, title: "Another Ticket" },
    ];

    // Act: Gọi hàm save và load
    storage.save(mockData);
    const loadedData = storage.load();

    // Assert: Kỳ vọng dữ liệu đọc lên phải y hệt dữ liệu đã lưu
    expect(fs.existsSync(testFilePath)).toBe(true); // File phải được tạo ra
    expect(loadedData).toEqual(mockData); // Dữ liệu không bị sai lệch
  });

  it("should return an empty array if the file does not exist", () => {
    const storage = new JsonStorage("./non-existent.json");

    const loadedData = storage.load();

    expect(loadedData).toEqual([]);
  });
});
