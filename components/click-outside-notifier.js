import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class ClickOutsideNotifier extends React.Component {
  constructor (props) {
    super(props)

    this.onClickDocument = e => {
      let modalEl = ReactDOM.findDOMNode(this.refs.container)
      if (this.clickedOutsideElement(modalEl, e)) {
        this.props.onOutsideClick(e)
      }
    }
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.onClickDocument, true)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.onClickDocument, true)
  }

  clickedOutsideElement (element, event) {
    var eventTarget = event.target || event.srcElement
    while (eventTarget) {
      if (eventTarget === element) {
        return false
      }
      eventTarget = eventTarget.parentNode
    }
    return true
  }

  render () {
    const { children, style = {}, className } = this.props

    return (
      <div style={style} ref='container' className={className}>
        {children}
      </div>
    )
  }
}

ClickOutsideNotifier.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
  onOutsideClick: PropTypes.func.isRequired
}

export default ClickOutsideNotifier
