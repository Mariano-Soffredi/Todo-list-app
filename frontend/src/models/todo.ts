export interface Task {
  _id: string
  title: string
  completed: boolean
}

export interface Todo {
  _id: string,
  title: string,
  description?: string,
  tasks: Array<Task>,
  createdAt: string,
  updatedAt: string,
}