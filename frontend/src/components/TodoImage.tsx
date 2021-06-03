import React, { useState } from 'react'
import { Button, Form, Header, Icon, Input, Modal } from 'semantic-ui-react'

const TodoImage = ({ idToken, todo, uploadImage }: any) => {
  const [open, setOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState('')
  
  const clear = (open: boolean) => {
    setOpen(open)
    setUploadFile('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files) {
      setUploadFile(e.target.files[0].name)
    }
  }

  const handleImageUpload = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!uploadFile) {
      alert('An upload image file should be selected')
      return
    }

    uploadImage(idToken, todo, uploadFile)
    setOpen(false)
  }

  return (
    <Modal
      onClose={() => clear(false)}
      onOpen={() => clear(true)}
      open={open}    
      trigger={
        <Button icon color="red">
          <Icon name="upload" />
        </Button>
      }>
      <Modal.Header>Upload Image</Modal.Header>
      <Modal.Content image>
        <Icon name="upload" circular inverted color="blue" size="huge"/>
        <Modal.Description>
          <Header>{todo.name}</Header>
          <Form>
            <Form.Field>
              <Input type='file' accept='image/*' placeholder='Image to upload' onChange={handleFileChange} />
            </Form.Field>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" autoFocus onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Upload"
          labelPosition='right'
          icon='upload'
          onClick={handleImageUpload}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default TodoImage
