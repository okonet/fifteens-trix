import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Board from '../../components/Board'
import * as actions from './actions'

function mapStateToProps(state) {
  return {
    tiles: state.board
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)
