import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateVideos } from '../../actions/videoAction'
import './VideoList.scss'
import { ReactSortable } from 'react-sortablejs'
import Video from './Video'

export class VideoList extends Component {
  static propTypes = {
    videos: PropTypes.array,
    updateVideos: PropTypes.func
  }

  render() {
    if (!this.props.videos.length) {
      return null
    }
  
    return (
      <ReactSortable tag="ul" list={this.props.videos} setList={this.props.updateVideos} handle=".video__move-handle" className="video-list">
        {this.props.videos.map(video => (
          <li key={video.id} className="video-item">
            <Video video={video} />
          </li>
        ))}
      </ReactSortable>
    )
  }
}

const mapStateToProps = state => ({
  videos: state.videos
})

const mapDispatchToProps = dispatch => ({
  updateVideos: videos => {
    dispatch(updateVideos(videos))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoList)
