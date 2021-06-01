import { Dimmer, Loader } from 'semantic-ui-react'

const Loading = () => {
  return (
    <div>
      <Dimmer active>
        <Loader active inverted>
          Loading...
        </Loader>
      </Dimmer>
    </div>
  )  
}

export default Loading
