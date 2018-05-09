package main

import game.*
import site.*

val PORT = 4567

fun main(args : Array<String>) {
    startServer(PORT)
}

fun printIteration3d(b : Board, t : BoardTransform, numIters: Int){
    assert(b.bound.numDimensions == 3)
    for (i in 0 until numIters) {
        for (x in 0 until b.getSizeInDimension(0)) {
            for (y in 0 until b.getSizeInDimension(1)) {
                for (z in 0 until b.getSizeInDimension(2)){
                    var l : List<Int> = arrayListOf(x, y, z)
                    print(b.getCellAt(NDimensionalCoordinate(3, l)))
                    print(" ")
                }
                println("+ + + + + + + + ")
            }
            println()
        }
        println("----------------------")
        b.transform(t)
    }
}

fun printIteration2d(b : Board, t : BoardTransform, numIters : Int) {
    assert(b.bound.numDimensions == 2)
    for (i in 0 until numIters) {
        for (x in 0 until b.getSizeInDimension(0)) {
            for (y in 0 until b.getSizeInDimension(1)) {
                var l : List<Int> = arrayListOf(x, y)
                print(b.getCellAt(NDimensionalCoordinate(2, l)))
                print(" ")
            }
            println()
        }
        println("----------------------")
        b.transform(t)
    }
}