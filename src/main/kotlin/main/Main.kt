package main

import game.*
import site.*


fun main(args : Array<String>) {
//    val b =  Board(NDimensionalCoordinate(2, arrayListOf(2, 10)))
//    printIteration2d(b, Swapper, 5)
//    val c = Board(NDimensionalCoordinate(3, arrayListOf(2, 2, 2)))
//    printIteration3d(c, Swapper, 1)
    demo()
}

fun printBoard(b : Board) {

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