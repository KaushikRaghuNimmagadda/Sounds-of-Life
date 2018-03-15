package game

import kotlin.math.abs

class NDimensionalCoordinate(val numDimensions : Int, var coords : List<Int>) {
    init {
        assert(numDimensions > 0)
        assert(numDimensions == coords.size)
    }

    fun getValAt(dim : Int) : Int {
        assert(dim < numDimensions && dim >= 0)
        return coords[dim]
    }

    // produces the largest difference between any two dimensions
    // of the two coordinates
    fun maxDif(other : NDimensionalCoordinate) : Int {
        assert(numDimensions == other.numDimensions)
        var maxDif = 0
        for (dim in 0 .. numDimensions) {
            var difference = abs(getValAt(dim) - other.getValAt(dim))
            maxDif = if (difference > maxDif) difference else maxDif
        }
        return maxDif
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as NDimensionalCoordinate

        if (numDimensions != other.numDimensions) return false
        for (dim : Int in 0 .. numDimensions - 1){
            if (other.getValAt(dim) != getValAt(dim)){
                return false
            }
        }
        return true
    }

    override fun hashCode(): Int {
        var result = numDimensions
        result = 31 * result + coords.hashCode()
        return result
    }
}


// generates all NDimensionalCoordinates from 0,0,...0 to the input coordinate inclusively
fun generateSpace(coord : NDimensionalCoordinate) : List<NDimensionalCoordinate> {
    val coordList : MutableList<MutableList<Int>> = ArrayList()
    val nd = coord.numDimensions
    val ranges : MutableList<IntRange> = ArrayList()
    for (dim : Int in 0 .. nd - 1){
        ranges.add(IntRange(0, coord.getValAt(dim)))
    }
    // produce all coordinates and store in coordList
    produceCoords(ranges, coordList, ArrayList(), 0)
    // map constructor over list of numbers, supplying appropriate dimension
    return coordList.map { NDimensionalCoordinate(nd, it) }
}

fun produceCoords(ranges : List<IntRange>, output : MutableList<MutableList<Int>>,
                  current : MutableList<Int>, depth : Int) : Unit {
    if (depth == ranges.size) {
        output.add(current)
        return
    }

    for (i in ranges[depth]){
        val copy = current.toMutableList()
        copy.add(i)
        produceCoords(ranges, output, copy, depth + 1)
    }
}
