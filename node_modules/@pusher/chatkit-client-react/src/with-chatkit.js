import React from "react"

import { ChatkitContext } from "./context"
import { getDisplayName } from "./utils"

/**
 * Wraps the given component and injects a Chatkit JavaScript SDK instance under
 * props.chatkit:
 *
 * @param {React.Component} WrappedComponent - Custom React component you would
 *      like to inject the Chatkit SDK into
 * @return {React.Component} A wrapped version of your component with the Chatkit
 *      SDK injected under props.chatkit
 *
 *
 * @example
 * const MyChatComponent = props => {
 *    // Base Chatkit SDK
 *    props.chatkit.currentUser // Reference to the CurrentUser object
 *    props.chatkit.chatManager // Reference to the ChatManager object
 * }
 */
export function withChatkit(WrappedComponent) {
  class WithChatkit extends React.Component {
    render() {
      return <WrappedComponent chatkit={this.context.chatkit} {...this.props} />
    }
  }
  WithChatkit.contextType = ChatkitContext
  WithChatkit.displayName = `WithChatkit(${getDisplayName(WrappedComponent)})`
  return WithChatkit
}
