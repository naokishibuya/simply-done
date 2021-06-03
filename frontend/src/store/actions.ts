import { Dispatch } from 'redux'
import todos from '../apis/todos'
import { TodosActionTypes, TodoAction, Todo } from './common'

const makeHeaders = (idToken: string) => {
  return { headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
  }}
}

const makeAction = (type: TodosActionTypes, todos: Todo[], error?: Error): TodoAction => {
  return { type, todos, error }
}

export const selectTodos = (idToken: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await todos.get(`/todos`, makeHeaders(idToken))
      return dispatch(makeAction(TodosActionTypes.SELECT, response.data))
    } catch(error) {
      return dispatch(makeAction(TodosActionTypes.SELECT, [], error))
    }
  }
}

export const createTodo = (idToken: string, todo: Todo) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await todos.post('/todos', JSON.stringify(todo), makeHeaders(idToken))
      return dispatch(makeAction(TodosActionTypes.CREATE, [response.data]))
    } catch (error) {
      return dispatch(makeAction(TodosActionTypes.CREATE, [], error))
    }
  }
}

export const updateTodo = (idToken: string, todo: Todo) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await todos.patch('/todos/', JSON.stringify(todo), makeHeaders(idToken))
      return dispatch(makeAction(TodosActionTypes.UPDATE, [response.data]))
    } catch (error) {
      return dispatch(makeAction(TodosActionTypes.UPDATE, [], error))
    }
  }
}

export const deleteTodo = (idToken: string, todo: Todo) => {
  return async (dispatch: Dispatch) => {
    try {
      await todos.delete(`/todos/${todo.todoId}`, makeHeaders(idToken))
      return dispatch(makeAction(TodosActionTypes.DELETE, [todo]))
    } catch (error) {
      return dispatch(makeAction(TodosActionTypes.DELETE, [], error))
    }
  }
}
