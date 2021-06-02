import { Reducer } from 'redux'
import { TodosActionTypes, TodoAction, Todo } from './common'

export const todosReducer: Reducer<Todo[], TodoAction> = (todos = [], action) => {
  if (action.type===TodosActionTypes.SELECT) {
    return action.todos
  }
  if (!action.todos) {
    return todos
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
