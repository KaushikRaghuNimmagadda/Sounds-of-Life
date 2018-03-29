package site

import com.google.gson.Gson import com.google.gson.JsonElement
import game.Board
import game.Conway
import game.NDimensionalCoordinate
import game.State
import io.ktor.application.call
import io.ktor.content.default
import io.ktor.content.files
import io.ktor.content.static
import io.ktor.content.staticRootFolder
import io.ktor.http.ContentType
import io.ktor.http.Parameters
import io.ktor.request.receive
import io.ktor.request.receiveParameters
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.*
import java.io.File
import kotlin.system.measureTimeMillis


val GSON = Gson()

fun stringToBoard(params: Parameters) : Board {
    val cells : MutableMap<NDimensionalCoordinate, State> = HashMap()
    val json : JsonElement = GSON.toJsonTree(params)
    println(json)
    val inner : JsonElement = json.asJsonObject["values"]
    println("size of received map: " + inner.asJsonObject.entrySet().size)
    for (entry in inner.asJsonObject.entrySet()) {
        val lst : List<Int> = entry.key.split(",").map { it.toInt() }
        val coord = NDimensionalCoordinate(lst.size, lst)
        val state = if (entry.value.asBoolean) State.ALIVE else State.DEAD
        cells[coord] = state
    }
    return Board(cells)
}

fun mapToBoard(params: Parameters) : Board {
    var cells : Map<NDimensionalCoordinate, State> = HashMap()
    val time = measureTimeMillis {
    val json : JsonElement = GSON.toJsonTree(params)
    for(entry in json.asJsonObject["values"].asJsonObject.entrySet()){
        val map = GSON.fromJson<Map<String, Boolean>>(entry.key, Map::class.java)
        cells = map.entries.associate {
            val lst = it.key.split(",").map {it.toInt()}
            NDimensionalCoordinate(lst.size, lst) to if(it.value) State.ALIVE else State.DEAD }
    }
    }
    println("TIME TO BOARD: " + time)
    return Board(cells.toMutableMap())
}

fun boardToJson(b : Board) : String {
    val newMap : Map<List<Int>, Boolean> = b.cells.entries.associate { it.key.coords to (it.value == State.ALIVE) }
    return GSON.toJson(newMap)
}

fun startServer() {
    embeddedServer(Netty, 4567) {
        routing {
            // set up all routes
            get("/") {
                call.respondText("Hello!", ContentType.Text.Html)
            }
            post("/update") {
                val elapsed = measureTimeMillis {
                val params = call.receiveParameters()
                val b : Board = mapToBoard(params)
                    println("ORIGINAL")
                    println(b)
                    val transformTime = measureTimeMillis {
                        // alright this is taking the lion's share of the time... MULTITHREAD
                        b.transform(Conway)
                    }
                    println("TRANSFORMED")
                    println(b)
                    println("TIME TO TRANSFORM: " + transformTime)
                val response = boardToJson(b)
                call.respond(response)
                }
                println(elapsed)
            }
            static ("game") {
                staticRootFolder = File("src/main/resources")
                files("js")
                default("html/game.html")
            }
        }
    }.start(wait=true)
}