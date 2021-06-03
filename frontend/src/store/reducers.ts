import { Reducer } from 'redux'
import { TodosActionTypes, TodoAction, Todo } from './common'

export const todosReducer: Reducer<Todo[], TodoAction> = (todos = [], action) => {
  if (action.error || !action.todos) {
    return todos
  }
  if (action.type===TodosActionTypes.SELECT) {
    return action.todos
  }
  const affected = action.todos[0]
  switch (action.type) {
    case TodosActionTypes.CREATE:
      return [...todos, affected]
    case TodosActionTypes.UPDATE:
      return todos.map(todo => (todo.todoId === affected.todoId) ? affected : todo)
    case TodosActionTypes.DELETE:
      return todos.filter(todo => todo.todoId !== affected.todoId)
    default:
      return todos
  }
}

export const errorReducer: Reducer<string, TodoAction> = (error = '', action) => {
  if (action.error) {
    console.log('EEEEEE')
    return `${action.type} failed: ${action.error}`
  }
  return ''
}