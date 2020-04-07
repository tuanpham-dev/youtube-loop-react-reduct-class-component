import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Button.scss'

export class Button extends Component {
  static propTypes = {
    color: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node
  }

  render() {
    let buttonClass = this.props.className + ' button'

    if (this.props.color) {
      buttonClass += ` button--${this.props.color}`
    }

    return (
      <button className={buttonClass} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}

export default Button
