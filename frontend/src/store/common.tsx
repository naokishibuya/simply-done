export interface Todo {
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}

export enum TodosActionTypes {
  SELECT = 'TODO/SELECT',
  CREATE = 'TODO/CREATE',
  UPDATE = 'TODO/UPDATE',
  DELETE = 'TODO/DELETE',
  UPLOAD = 'TODO/UPLOAD'
}

export interface TodoAction {
  type: TodosActionTypes
  todos: Todo[]
  error?: Error
}

export type AppState = {
  todos: Todo[]
  error: string
}
