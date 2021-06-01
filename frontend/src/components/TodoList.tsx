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

const TodoList = ({todos, selectTodos, createTodo, updateTodo, deleteTodo}: any) => {
  const { user, isLoading, getIdTokenClaims } = useAuth0()
  const [ idToken, setIdToken ] = useState('')

  useEffect(() => {
    (async () => {
      const idTokenClaims = await getIdTokenClaims()
      setIdToken(idTokenClaims.__raw)
      selectTodos(user?.email, idTokenClaims.__raw)
    })()
  }, [user, selectTodos, setIdToken, getIdTokenClaims])

  return (
    <div>
      <Divider />
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={10} verticalAlign="middle">
            <Header as="h1">Tasks for {user?.name}</Header>
          </Grid.Column>
          <Grid.Column width={2} floated="right">
            <TodoCreate user={user?.email} createTodo={createTodo} idToken={idToken} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider />
      <Grid padded>
        {isLoading ? <Loading /> : todos.map((todo: Todo) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox checked={todo.done} onChange={
                  () => updateTodo({...todo, done: !todo.done}, idToken)}/>
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
                <TodoUpdate todo={todo} updateTodo={updateTodo} idToken={idToken}/>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <TodoDelete todo={todo} deleteTodo={deleteTodo} idToken={idToken} />
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
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
