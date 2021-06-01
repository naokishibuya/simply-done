import { useState } from 'react'
import { Button, Checkbox, Grid, Icon, Input, Modal } from 'semantic-ui-react'

const TodoUpdate = ({ todo, updateTodo, idToken }: any) => {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [name, setName] = useState('')

  const clear = (open: boolean) => {
    setOpen(open)
    setDone(todo.done)
    setName(todo.name)
  }

  const handleUpdate = () => {
    updateTodo({...todo, name: name, done: done}, idToken)
    setOpen(false)
  }

  return (
    <Modal
      onClose={() => clear(false)}
      onOpen={() => clear(true)}
      open={open}    
      trigger={
        <Button icon color="blue">
          <Icon name="pencil" />
        </Button>
      }>
      <Modal.Header>Edit TODO</Modal.Header>
      <Modal.Content image>
        <Icon name="edit" circular inverted color="blue" size="huge"/>
        <Modal.Description>
          <Grid padded>
            <Grid.Row verticalAlign="middle">
              <Grid.Column width={2}>
                <Checkbox checked={done} onChange={() => setDone(!done)} />
              </Grid.Column>
              <Grid.Column width={10}>
                <Input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  size="big"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Description>
    </Modal.Content>
    <Modal.Actions>
      <Button color="black" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button
        content="Update"
        labelPosition='right'
        icon='checkmark'
        onClick={handleUpdate}
        positive
      />
    </Modal.Actions>
    </Modal>
  )
}

export default TodoUpdate
