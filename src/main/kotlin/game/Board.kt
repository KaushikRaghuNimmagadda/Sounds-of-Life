package game

import java.util.*

class Board {
    // mapping
    var cells : MutableMap<NDimensionalCoordinate, State> = HashMap()
    val bound : NDimensionalCoordinate
    constructor(bound: NDimensionalCoordinate) {
        this.bound = bound
        for (coord : NDimensionalCoordinate in generateSpace(bound)){
            cells[coord] = State.DEAD
        }
    }

    constructor(bound: NDimensionalCoordinate, alive: Set<NDimensionalCoordinate>) {
        this.bound = bound
        // assert that the alive set are of the same dimension as the bound
        assert(alive.all { it.numDimensions == bound.numDimensions })
        for (coord : NDimensionalCoordinate in generateSpace(bound)){
            if(coord in alive) {
                cells[coord] = State.ALIVE
            } else {
                cells[coord] = State.DEAD
            }
        }
    }

    // size of board in a given dimension
    fun getSizeInDimension(dim : Int) : Int {
        assert(dim >= 0 && dim < bound.numDimensions)
        return bound.getValAt(dim)
    }
    // gets cell at certain coordinates
    fun getCellAt(coord : NDimensionalCoordinate) : State {
        return cells[coord] ?: throw IllegalArgumentException("coord not in board")
    }
    // gets neighbors of a given location
    fun getNeighbors(coord : NDimensionalCoordinate) : List<NDimensionalCoordinate> {
        assert(coord.numDimensions == bound.numDimensions)
        return cells.keys.filter { coord.maxDif(it) <= 1 }
    }

    // counts neighbors that have a certain state
    fun getNeighborCount(coord : NDimensionalCoordinate, state : State) : Int {
        return getNeighbors(coord).filter { getCellAt(it) == state }.size
    }

    // transforms board based on some function
    fun transform(t : BoardTransform) {
        // can't modify existing map b/c need to refer to the unaltered
        // original board to determine transformations
        val newCells : MutableMap<NDimensionalCoordinate, State> = HashMap()
        for (k : NDimensionalCoordinate in cells.keys) {
            newCells[k] = t.update(k, this)
        }
        cells = newCells
    }
}
