import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './Header.scss'
import Button from '../Button/Button'
import { addVideoByYouTubeId, playFirstVideo, stopVideo, playNextVideo, playPreviousVideo } from '../../actions/videoAction'

export class Header extends Component {
  static propTypes = {
    videos: PropTypes.array,
    playingVideo: PropTypes.object,
    onAddButtonClick: PropTypes.func,
    onPlayButtonClick: PropTypes.func,
    onStopButtonClick: PropTypes.func,
    onNextButtonClick: PropTypes.func,
    onPreviousButtonClick: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      input: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      input: event.target.value
    })
  }

  render() {
    const videosCount = this.props.videos.length
    const isPlaying = this.props.playingVideo.id !== null
    const canPlayNextPrev = isPlaying && videosCount > 1

    return (
      <header className="header">
        <div className="container">
          <a href="/" className="header__logo">YouTube Loop</a>
          
          {videosCount > 0 &&
            <div className="header__controls">
              {isPlaying ?
                <Button onClick={this.props.onStopButtonClick}>Stop</Button>
                :
                <Button onClick={this.props.onPlayButtonClick}>Play</Button>
              }

              {canPlayNextPrev &&
                <>
                  <Button onClick={this.props.onPreviousButtonClick}>Previous</Button>
                  <Button onClick={this.props.onNextButtonClick}>Next</Button>
                </>
              }
            </div>
          }

          <div className="header__input-group">
            <input type="text" className="header__input"
              placeholder="Enter YouTube URL or Video ID"
              value={this.state.input}
              onChange={this.handleInputChange}
            />
            <div className="header__input-group-append">
              <Button color="blue" onClick={() => this.props.onAddButtonClick(this.state.input)}>Go Loop!</Button>
            </div>
          </div>      
        </div>
      </header>
    )
  }
}

const mapStateToProps = (state) => ({
  videos: state.videos,
  playingVideo: state.playingVideo
})

const mapDispatchToProps = dispatch => ({
  onAddButtonClick: (input) => {
    dispatch(addVideoByYouTubeId(input))
  },
  onPlayButtonClick: () => {
    dispatch(playFirstVideo())
  },
  onStopButtonClick: () => {
    dispatch(stopVideo())
  },
  onNextButtonClick: () => {
    dispatch(playNextVideo())
  },
  onPreviousButtonClick: () => {
    dispatch(playPreviousVideo())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
