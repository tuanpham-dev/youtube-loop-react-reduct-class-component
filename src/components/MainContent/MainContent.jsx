import React, { Component } from 'react'
import VideoList from '../Video/VideoList'

export class MainContent extends Component {
  render() {
    return (
      <div className="main">
        <div className="container">
          <VideoList />
        </div>
      </div>
    )
  }
}

export default MainContent
