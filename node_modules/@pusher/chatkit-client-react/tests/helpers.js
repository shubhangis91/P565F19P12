import PropTypes from "prop-types"
import React from "react"
import TestRenderer from "react-test-renderer"

import { ChatkitProvider } from "../src"

class TestComponent extends React.Component {
  constructor() {
    super()
    this._onLoadHasRun = false
  }

  componentDidUpdate() {
    if (!this.props.chatkit.isLoading && !this._onLoadHasRun) {
      this.props.onLoad(this.props)
      this._onLoadHasRun = true
    }
  }

  render() {
    this.props.callback(this.props)
    return null
  }
}
TestComponent.propTypes = {
  onLoad: PropTypes.func,
  callback: PropTypes.func,
  chatkit: PropTypes.object,
}

export const runInTestRenderer = ({
  instanceLocator,
  tokenProvider,
  userId,
  higherOrderComponent,
  resolveWhen,
  onLoad = () => {},
  wrappedComponentProps = {},
}) => {
  const WrappedComponent = higherOrderComponent(TestComponent)

  let initialProps = null

  return new Promise(resolve => {
    const page = (
      <ChatkitProvider
        instanceLocator={instanceLocator}
        tokenProvider={tokenProvider}
        userId={userId}
      >
        <WrappedComponent
          onLoad={onLoad}
          {...wrappedComponentProps}
          callback={props => {
            if (initialProps === null) {
              initialProps = props
            }
            const shouldReturn = resolveWhen(props)
            if (shouldReturn) {
              resolve({ props, initialProps })
            }
          }}
        />
      </ChatkitProvider>
    )
    TestRenderer.create(page)
  })
}
