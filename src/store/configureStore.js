import { createStore } from 'redux'
import rootReducer from '../reducers'
import { loadState, saveState } from '../utils/localStorage'
import throttle from 'lodash.throttle'

const defaultState = {
  videos: [],
  playingVideo: {
    id: null
  }
}

export default (initialState) => {
  if (initialState === undefined) {
    const state = loadState()
    initialState = {
      ...defaultState,
      ...state
    }
  }

  const store = createStore(rootReducer, initialState)

  store.subscribe(throttle(() => {
    saveState(store.getState())
  }, 1000))

  return store
}
