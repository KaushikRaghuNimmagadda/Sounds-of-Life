package game

import java.util.*
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import kotlin.collections.ArrayList
import kotlin.collections.HashMap

fun <T, R> Collection<T>.pmap(
        numThreads : Int = Runtime.getRuntime().availableProcessors() - 2,
        exec : ExecutorService = Executors.newFixedThreadPool(numThreads),
        transform : (T) -> R) : List<R> {
    val dest = Collections.synchronizedList(ArrayList<R>(this.size))
    for(item in this) {
        exec.submit {dest.add(transform(item)) }
    }
    exec.shutdown()
    exec.awaitTermination(1, TimeUnit.DAYS)
    return ArrayList<R>(dest)
}

fun <T, K, V> Sequence<T>.passociate(
        numThreads : Int = 6,
        exec : ExecutorService = Executors.newFixedThreadPool(numThreads),
        transform : (T) -> Pair<K, V>) : Map<K, V> {
    val dest = Collections.synchronizedMap(HashMap<K, V>())
    for(item in this) {
        exec.submit { dest += transform(item) }
    }
    exec.shutdown()
    exec.awaitTermination(1, TimeUnit.DAYS)
    return dest
}



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

    constructor(cells: MutableMap<NDimensionalCoordinate, State>) {
        // bound is coord with largest sum of coordinates.
        this.bound = cells.keys.maxBy { it.coords.sum() }!!
        assert(cells.keys.all { it.numDimensions == bound.numDimensions })
        this.cells = cells
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
        return cells.keys.filter { coord.maxDif(it) == 1 }
    }

    // counts neighbors that have a certain state
    fun getNeighborCount(coord : NDimensionalCoordinate, state : State) : Int {
        return getNeighbors(coord).filter { getCellAt(it) == state }.size
    }

    // transforms board based on some function
    fun transform(t : BoardTransform) {
        // can't modify existing map b/c need to refer to the unaltered
        // original board to determine transformations
//        val newEntries = cells.entries.pmap { Pair(it.key, t.update(it.key, this)) }
//        for(pair in newEntries) {
//            cells[pair.first] = pair.second
//        }
        // using parallel version of associate for performance improvement
        cells = cells.entries.asSequence().passociate { Pair(it.key, t.update(it.key, this)) }.toMutableMap()
    }

    override fun toString(): String {
        return "Board(cells=$cells, bound=$bound)"
    }
}
