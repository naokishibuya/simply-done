import { useState } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

const TodoDelete = ({ idToken, todo, deleteTodo }: any) => {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    deleteTodo(idToken, todo)
    setOpen(false)
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}    
      trigger={
        <Button icon color="red">
          <Icon name="delete" />
        </Button>
      }>
      <Modal.Header>Delete Confirmation</Modal.Header>
      <Modal.Content image>
        <Icon name="remove" circular inverted color="red" size="huge"/>
        <Modal.Description>
          <Header>{todo.name}</Header>
        <p>
          Are you sure you want to remove the todo item?
        </p>
      </Modal.Description>
    </Modal.Content>
    <Modal.Actions>
      <Button color="black" onClick={() => setOpen(false)}>
        Nope
      </Button>
      <Button
        content="Yep"
        labelPosition='right'
        icon='checkmark'
        onClick={handleDelete}
        positive
      />
    </Modal.Actions>
    </Modal>
  )
}

export default TodoDelete
