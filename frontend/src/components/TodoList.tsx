import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Checkbox, Divider, Grid, Header } from 'semantic-ui-react'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from './Loading'
import { selectTodos, createTodo, updateTodo, deleteTodo } from '../store/actions'
import { Todo, AppState } from '../store/common'
import TodoCreate from './TodoCreate'
import TodoDelete from './TodoDelete'
import TodoUpdate from './TodoUpdate'

const UserRow = ({idToken, user, createTodo}: any) => {
  return (
    <Grid.Row>
      <Grid.Column width={10} verticalAlign="middle">
        <Header as="h1">Tasks for {user?.name}</Header>
      </Grid.Column>
      <Grid.Column width={2} floated="right">
        <TodoCreate user={user?.email} idToken={idToken} createTodo={createTodo} />
      </Grid.Column>
      <Grid.Column width={16}>
        <Divider />
      </Grid.Column>
    </Grid.Row>
  )
}

const TodoRow = ({idToken, todo, updateTodo, deleteTodo}: any) => {
  return (
    <Grid.Row>
      <Grid.Column width={1} verticalAlign="middle">
        <Checkbox checked={todo.done} onChange={
          () => updateTodo(idToken, {...todo, done: !todo.done})}/>
      </Grid.Column>
      <Grid.Column width={8} verticalAlign="middle">
        {todo.name}
      </Grid.Column>
      <Grid.Column width={2} floated="right">
        {todo.createdAt}
      </Grid.Column>
      <Grid.Column width={2} floated="right">
        {todo.dueDate}
      </Grid.Column>
      <Grid.Column width={1} floated="right">
        <TodoUpdate todo={todo} idToken={idToken} updateTodo={updateTodo} />
      </Grid.Column>
      <Grid.Column width={1} floated="right">
        <TodoDelete todo={todo} idToken={idToken} deleteTodo={deleteTodo} />
      </Grid.Column>
      <Grid.Column width={16}>
        <Divider />
      </Grid.Column>
    </Grid.Row>
  )
}

const TodoList = ({todos, selectTodos, createTodo, updateTodo, deleteTodo}: any) => {
  const { user, isLoading, getIdTokenClaims } = useAuth0()
  const [ idToken, setIdToken ] = useState('')

  useEffect(() => {
    (async () => {
      const idTokenClaims = await getIdTokenClaims()
      const token = idTokenClaims.__raw
      setIdToken(token)
      selectTodos(token)
    })()
  }, [user, selectTodos, setIdToken, getIdTokenClaims])

  return (
    <div>
      <Divider />
      <Grid padded>
        <UserRow idToken={idToken} user={user} createTodo={createTodo}/>
        {
          isLoading ? <Loading /> : todos.map((todo: Todo) => {
            return (
              <TodoRow key={todo.todoId}
                idToken={idToken}
                todo={todo}
                updateTodo={updateTodo}
                deleteTodo={deleteTodo} />
            )
          })
        }
      </Grid>
    </div>
  )
}

const mapStateToProps = (store: AppState) => {
  return {
    todos: store.todos
  };
};

export default withAuthenticationRequired(
  connect(
    mapStateToProps, {
      selectTodos,
      createTodo,
      updateTodo,
      deleteTodo
    }
  )(TodoList)
)
