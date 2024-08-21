interface Priority {
  CRITICAL: 1;
  HIGH: 2;
  MEDIUM: 3;
  LOW: 4;
}

interface Task {
  name: string;
  id: string;
  priority: "1" | "2" | "3" | "4";
  createdAt: Date;
  dueDate: Date;
  completed: boolean;
  completedOn?: Date;
  projectId?: string;
  assignedTo: {
    name?: string;
  };
  project: {
    name?: string
  }
  createdBy: {
    name?: string
  }
}

interface Project {
  id: string;
  name: string;
}

interface ProjectTaskRes {
  id: string;
  name: string;
  userId: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
}

interface Invitation {
  id: string;
  invitedByUser: {
    name: string;
    id: string;
    createdAt: Date;
  };
  invitedProject: {
    name: string;
    id: string;
  };
}
