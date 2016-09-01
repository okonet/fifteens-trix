import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Board from '../components/Board'
import * as BoardActions from '../actions/board'

function mapStateToProps(state) {
  return {
    tiles: state.board
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(BoardActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)
