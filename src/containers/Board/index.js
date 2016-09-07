import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Board from '../../components/Board'
import * as actions from './actions'

function mapStateToProps(state) {
  const { tiles, cols, rows } = state.board
  return {
    tiles,
    cols,
    rows
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)
