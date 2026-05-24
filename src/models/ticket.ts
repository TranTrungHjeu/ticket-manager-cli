export type Status = "open" | "in_progress" | "done";

export type Priority = "low" | "medium" | "high";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}
