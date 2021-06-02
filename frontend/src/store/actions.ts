import { Dispatch } from 'redux'
import todos from '../apis/todos'
import { TodosActionTypes, TodoAction, Todo } from './common'

const makeHeaders = (idToken: string) => {
  return { headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
  }}
}

const makeAction = (type: TodosActionTypes, todos: Todo[], error?: any) => {
  const action: TodoAction = {
    type: type,
    todos: todos
  }
  return action
}

export const selectTodos = (idToken: string) => {
  return async (dispatch: Dispatch) => {
    const response = await todos.get(`/todos`, makeHeaders(idToken))
    return dispatch(makeAction(TodosActionTypes.SELECT, response.data))
  }
}

export const createTodo = (idToken: string, todo: Todo) => {
  return async (dispatch: Dispatch) => {
    const response = await todos.post('/todos', JSON.stringify(todo), makeHeaders(idToken))
    return dispatch(makeAction(TodosActionTypes.CREATE, [response.data]))
  }
}

export const updateTodo = (idToken: string, todo: Todo) => {
  return async (dispatch: Dispatch) => {
    const response = await todos.patch('/todos/', JSON.stringify(todo), makeHeaders(idToken))
    return dispatch(makeAction(TodosActionTypes.UPDATE, [response.data]))
  }
}

export const deleteTodo = (idToken: string, todo: Todo) => {
  return async (dispatch: Dispatch) => {
    await todos.delete(`/todos/${todo.todoId}`, makeHeaders(idToken))
    return dispatch(makeAction(TodosActionTypes.DELETE, [todo]))
  }
}
