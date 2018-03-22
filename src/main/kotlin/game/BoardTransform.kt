package game

interface BoardTransform {
    fun update(coord : NDimensionalCoordinate, board : Board) : State
}

// class for easy construction of board transformations
// declared open so we can subclass it and just provide default arguments
// do we want to make a factory from the game strings to these? Probably not needed.
open class TemplateTransform(val birthCounts : Set<Int>, val surviveCounts : Set<Int>) : BoardTransform {
    override fun update(coord: NDimensionalCoordinate, board: Board): State {
        val liveCount = board.getNeighborCount(coord, State.ALIVE)
        val curState : State = board.getCellAt(coord)
        if(curState == State.DEAD && liveCount in birthCounts) {
            // cell rebirth
            return State.ALIVE
        } else if(curState == State.ALIVE && liveCount in surviveCounts) {
            // cell stays alive
            return State.ALIVE
        }
        return State.DEAD
    }
}

// conway's rules using template transform
object CWay : TemplateTransform(setOf(3), setOf(2, 3))

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

object HighLife : TemplateTransform(setOf(3, 6), setOf(2, 3))
