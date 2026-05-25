export type Status = "open" | "in_progress" | "done";

export type Priority = "low" | "medium" | "high";

export class Ticket {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    title: string,
    description: string,
    priority: Priority,
    tags: string[] = [],
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.tags = tags;

    // Khởi tạo các giá trị mặc định
    this.status = "open";
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
