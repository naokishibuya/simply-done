import * as todosDb from './todosDb'

export interface TodoItem {
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}

export const getTodos = async (userId: string) => {
  const todos = await todosDb.getAllTodos(userId)
  return todos
}

export const createTodo = async (userId: string, todo: TodoItem) => {
  const added = await todosDb.createTodo(userId, todo)
  return added
}

export const updateTodo = async (userId: string, todo: TodoItem) => {
  const updated = await todosDb.updateTodo(userId, todo)
  return updated
}

export const deleteTodo = async (userId: string, todoId: string) => {
  await todosDb.deleteTodo(userId, todoId)
}
