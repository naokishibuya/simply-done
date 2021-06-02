import { Dispatch } from 'redux'
import todos from '../apis/todos'
import { TodosActionTypes, TodoAction, Todo } from './common'

const makeHeaders = (idToken: string) => {
  return { headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
  }}
}

export const selectTodos = (idToken: string) => {
  return async (dispatch: Dispatch) => {
    const response = await todos.get(`/todos`, makeHeaders(idToken))
    const action: TodoAction = {
      type: TodosActionTypes.SELECT,
      todos: response.data
    }
    return dispatch(action)
  };
};

export const createTodo = (idToken: string, todo: Todo) => {
  return async (dispatch: Dispatch) => {
    const response = await todos.post('/todos', todo, makeHeaders(idToken))
    const action: TodoAction = {
      type: TodosActionTypes.CREATE,
      todos: [response.data]
    }
    return dispatch(action)
  }
}

export const updateTodo = (idToken: string, todo: Todo) => {
  return async (dispatch: Dispatch) => {
    const response = await todos.patch('/todos/', todo, makeHeaders(idToken))
    const action: TodoAction = {
      type: TodosActionTypes.UPDATE,
      todos: [response.data]
    }
    return dispatch(action)
  }
}

export const deleteTodo = (idToken: string, todo: Todo) => {
  return async (dispatch: Dispatch) => {
    await todos.delete(`/todos/${todo.todoId}`, makeHeaders(idToken))
    const action: TodoAction = {
      type: TodosActionTypes.DELETE,
      todos: [todo]
    }
    return dispatch(action)
  }
}
