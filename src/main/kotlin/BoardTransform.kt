package game

interface BoardTransform {
    fun update(coord : NDimensionalCoordinate, board : Board) : State
}

// singleton
object Conway : BoardTransform {
    override fun update(coord: NDimensionalCoordinate, board: Board): State {
        val liveCount = board.getNeighborCount(coord, State.ALIVE)
        val curState : State = board.getCellAt(coord)
        if(curState == State.DEAD) {
            when (liveCount) {
                3 -> return State.ALIVE
                else -> return State.DEAD
            }
        } else {
            // cell is alive
            when (liveCount) {
                // cell dies of underpopulation
                0, 1 -> return State.DEAD
                // cell stays alive
                2, 3 -> return State.ALIVE
                // cell dies of overcrowding
                else -> return State.DEAD
            }
        }
    }
}

object Swapper : BoardTransform {
    override fun update(coord: NDimensionalCoordinate, board: Board): State {
        val curState = board.getCellAt(coord)
        return if (curState == State.DEAD) State.ALIVE else State.DEAD
    }
}
