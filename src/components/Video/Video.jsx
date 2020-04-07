import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './Video.scss'
import YouTube from './YouTube'
import Button from '../Button/Button'
import { removeVideo, editVideo, playVideo, playNextVideo } from '../../actions/videoAction'
import timeFormat from '../../utils/timeFormat'
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'

export class Video extends Component {
  static propTypes = {
    videos: PropTypes.array,
    video: PropTypes.object,
    playingVideo: PropTypes.object,
    removeVideo: PropTypes.func,
    editVideo: PropTypes.func,
    playVideo: PropTypes.func,
    playNextVideo: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.container = createRef()
    this.videoLoaded = false
    this.player = null
    this.duration = 0
    this.title = ''
    this.interval = null

    this.setVideoVolume = this.setVideoVolume.bind(this)
    this.setVideoRange = this.setVideoRange.bind(this)
    this.removeVideo = this.removeVideo.bind(this)
    this.onVideoLoaded = this.onVideoLoaded.bind(this)
    this.onPlaying = this.onPlaying.bind(this)
    this.onEnded = this.onEnded.bind(this)
    this.onError = this.onError.bind(this)
    this.trackStatus = this.trackStatus.bind(this)
  }

  setVideoVolume(volume) {
    if (this.player) {
      this.player.setVolume(volume)
    }

    this.props.editVideo({
      ...this.props.video,
      volume
    })
  }

  setVideoRange(range) {
    if (this.player && this.props.playingVideo.id === this.props.video.id) {
      const currentTime = this.player.getCurrentTime()

      if (range[0] > currentTime) {
        this.player.seekTo(range[0])
      }
    }

    this.props.editVideo({
      ...this.props.video,
      range
    })
  }

  removeVideo() {
    this.props.removeVideo(this.props.video.id)
  }

  onVideoLoaded(player) {
    const duration = player.getDuration()
    this.videoLoaded = false

    if (!duration) {
      this.props.removeVideo(this.props.video.id)
    } else {
      this.player = player
      this.duration = duration

      if (this.props.video.volume === null || this.props.video.range[0] === null || this.props.video.range[1] === null) {
        this.props.editVideo({
          ...this.props.video,
          volume: player.getVolume(),
          range: [0, duration]
        })
      }

      if (this.props.playingVideo.id === this.props.video.id) {
        player.setVolume(this.props.video.volume)
        player.seekTo(this.props.video.range[0], true)
        player.playVideo()

        document.title = this.title + ' - YouTube Loop in React Redux'
      }
    }

    this.videoLoaded = true
  }

  onPlaying() {
    if (this.props.playingVideo.id !== this.props.video.id) {
      this.props.playVideo(this.props.video.id)
    }
  }

  onEnded() {
    this.props.playNextVideo()
  }

  onError() {
    this.props.removeVideo(this.props.video)
  }

  trackStatus() {
    if (this.player) {
      const currentTime = this.player.getCurrentTime()
      const playerState = this.player.getPlayerState()
      const volume = this.player.getVolume()

      if (volume !== this.props.video.volume) {
        this.setVideoVolume(volume)
      }

      if (playerState === 1 && currentTime > this.props.video.range[1]) {
        this.onEnded()
      }
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.trackStatus, 500)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidUpdate(prevProps) {
    if (this.player && this.props.playingVideo !== prevProps.playingVideo) {
      if (this.props.playingVideo.id === this.props.video.id) {
        this.player.setVolume(this.props.video.volume)
        this.player.seekTo(this.props.video.range[0], true)
        this.player.playVideo()

        document.title = this.title + ' - YouTube Loop in React Redux'
        this.container.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      } else {
        this.player.pauseVideo()
        document.title = 'YouTube Loop in React Redux'
      }
    }
  }

  render() {
    const canMove = this.props.videos.length > 1
    const isPlaying = this.props.playingVideo.id === this.props.video.id
    const className = 'video' + (isPlaying ? ' video--active' : '')

    return (
      <div ref={this.container} className={className}>
        <div className="video__player">
          <YouTube youtubeId={this.props.video.youtubeId} onReady={this.onVideoLoaded} onPlaying={this.onPlaying}  onEnded={this.onEnded} onError={this.onError} />
        </div>

        {this.videoLoaded &&
          <>
            <Slider className="video__volume-slider" vertical="true" value={this.props.video.volume} onChange={this.setVideoVolume} />
            <Range className="video__range-slider" max={this.duration} value={this.props.video.range} onChange={this.setVideoRange} />
            <div className="video__info">{`Volume: ${this.props.video.volume} — Range: ${timeFormat(this.props.video.range[0])} → ${timeFormat(this.props.video.range[1])}`}</div>
          </>
        }

        <div className="video__buttons">
          {canMove &&
            <Button className="video__move-handle">Move</Button>
          }
          <Button color="red" onClick={this.removeVideo}>Remove Video</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  videos: state.videos,
  playingVideo: state.playingVideo
})

const mapDispatchToProps = dispatch => ({
  removeVideo: videoId => {
    dispatch(removeVideo(videoId))
  },
  editVideo: video => {
    dispatch(editVideo(video))
  },
  playVideo: videoId => {
    dispatch(playVideo(videoId))
  },
  playNextVideo: () => {
    dispatch(playNextVideo())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Video)
