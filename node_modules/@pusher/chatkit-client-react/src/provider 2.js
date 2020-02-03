import chatkit from "@pusher/chatkit-client"
import PropTypes from "prop-types"
import React from "react"

import { ChatkitContext } from "./context"

/**
 * Wrapper component used to take Chatkit connection configuration
 * (instance ID, token provider, user ID, etc.) and injects a configured
 * Chatkit SDK instance via a React Context.
 * @example
 *  <ChatkitProvider
 *    instanceLocator={<YOUR_INSTANCE_ID_HERE>}
 *    tokenProvider={<YOUR_TOKEN_PROVIDER_HERE>}
 *    userId={<CURRENT_USER_ID_HERE>}
 *  >
 *    <App>
 *      Your application
 *    </App>
 *  </ChatkitProvider>
 * @extends React.Component
 */
export class ChatkitProvider extends React.Component {
  constructor() {
    super()
    this.state = {
      chatkit: {
        chatManager: null,
        currentUser: null,
        isLoading: true,
      },
      onLoadListeners: [],
    }
  }

  addOnLoadListener(listener) {
    this.setState(state => ({
      onLoadListeners: [listener, ...state.onLoadListeners],
    }))
  }

  componentDidMount() {
    const chatManager = new chatkit.ChatManager({
      instanceLocator: this.props.instanceLocator,
      tokenProvider: this.props.tokenProvider,
      userId: this.props.userId,
      sdkLanguage: "chatkit-client-react",
    })

    chatManager
      .connect()
      .then(currentUser => {
        this.setState(
          {
            chatkit: { chatManager, currentUser, isLoading: false },
          },
          () => this.state.onLoadListeners.forEach(l => l()),
        )
      })
      .catch(error => {
        // TODO: Error logging?
        console.error(error)
      })
  }

  render() {
    return (
      <ChatkitContext.Provider
        value={{
          addOnLoadListener: l => this.addOnLoadListener(l),
          ...this.state,
        }}
      >
        {this.props.children}
      </ChatkitContext.Provider>
    )
  }
}

ChatkitProvider.propTypes = {
  instanceLocator: PropTypes.string.isRequired,
  tokenProvider: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
}
