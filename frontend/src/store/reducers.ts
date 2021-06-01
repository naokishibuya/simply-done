import { Reducer } from 'redux'
import { TodosActionTypes, TodoAction, Todo } from './common'

export const todosReducer: Reducer<Todo[], TodoAction> = (todos = [], action) => {
  switch (action.type) {
    case TodosActionTypes.SELECT:
      return action.todos
    case TodosActionTypes.CREATE:
      return [...todos, action.todos[0]]
    case TodosActionTypes.UPDATE:
      return todos.map(todo => {
        if (todo.todoId === action.todos[0].todoId) {
          return action.todos[0]
        }
        return todo
      })
    case TodosActionTypes.DELETE:
      return todos.filter(todo => todo.todoId !== action.todos[0].todoId)
    default:
      return todos;
  }
}
