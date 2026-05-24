export type Status = "open" | "in_progress" | "done";

export type Priority = "low" | "medium" | "high";

export class Ticket {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    title: string,
    description: string,
    priority: Priority,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;

    // Khởi tạo các giá trị mặc định
    this.status = "open";
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
