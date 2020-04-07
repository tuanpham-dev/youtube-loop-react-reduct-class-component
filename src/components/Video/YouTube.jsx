import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import loadYouTubeAPI from '../../utils/loadYouTubeAPI'

export class YouTube extends Component {
  static propTypes = {
    youtubeId: PropTypes.string,
    onReady: PropTypes.func,
    onPlaying: PropTypes.func,
    onPaused: PropTypes.func,
    onEnded: PropTypes.func,
    onError: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.container = createRef()
    this.handleVideoReady = this.handleVideoReady.bind(this)
    this.handleVideoStateChange = this.handleVideoStateChange.bind(this)
  }

  handleVideoReady() {
    if (typeof this.props.onReady === 'function') {
      this.props.onReady(this.player)
    }
  }

  handleVideoStateChange(event) {
    if (event.data === this.YT.PlayerState.PLAYING) {
      if (typeof this.props.onPlaying === 'function') {
        this.props.onPlaying()
      }
    } else if (event.data === this.YT.PlayerState.PAUSED) {
      if (typeof this.props.onPaused === 'function') {
        this.props.onPaused()
      }
    } else if (event.data === this.YT.PlayerState.ENDED) {
      if (typeof this.props.onEnded === 'function') {
        this.props.onEnded()
      }
    }
  }

  componentDidMount() {
    loadYouTubeAPI().then(YT => {
      this.YT = YT
      this.player = new YT.Player(this.container.current, {
        videoId: this.props.youtubeId,
        events: {
          onReady: this.handleVideoReady,
          onStateChange: this.handleVideoStateChange
        }
      })
    })
  }

  render() {
    return (
      <div ref={this.container}></div>
    )
  }
}

export default YouTube
