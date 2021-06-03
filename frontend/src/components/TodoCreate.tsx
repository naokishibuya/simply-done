import { useState } from 'react'
import { Button, Icon, Input, Modal, Placeholder } from 'semantic-ui-react'
import dateformat from 'dateformat'
import { Todo } from '../store/common'

const TodoCreate = ({ idToken, createTodo }: any) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const clear = (open: boolean) => {
    setOpen(open)
    setName('')
  }

  const handleCreate = () => {
    const dateString = (addDays: number) => {
      const date = new Date()
      date.setDate(date.getDate() + addDays)
      return dateformat(date, 'yyyy-mm-dd')
    }

    const todo: Todo = {
      todoId: '',
      createdAt: dateString(0),
      name: name,
      dueDate: dateString(7),
      done: false,
      attachmentUrl: undefined
    }
    createTodo(idToken, todo)
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
          <Placeholder />
          <Placeholder />
          Add Task
        </Button>
      }>
      <Modal.Header>Add Task</Modal.Header>
      <Modal.Content image>
        <Icon name="add" circular inverted color="green" size="huge"/>
        <Modal.Description>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Enter your todo here...'
            size="big"
            autoFocus
         />
        </Modal.Description>
    </Modal.Content>
    <Modal.Actions>
      <Button color="black" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button
        content="Add"
        labelPosition='right'
        icon='checkmark'
        onClick={handleCreate}
        positive
      />
    </Modal.Actions>
    </Modal>
  )
}

export default TodoCreate
