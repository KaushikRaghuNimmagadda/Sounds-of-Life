package site

import com.google.gson.Gson
import com.google.gson.JsonElement
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

fun mapToBoard(params: Parameters) : Board {
    val cells : MutableMap<NDimensionalCoordinate, State> = HashMap()
    val json : JsonElement = GSON.toJsonTree(params)
    val inner : JsonElement = json.asJsonObject["values"]
    for (entry in inner.asJsonObject.entrySet()) {
        val lst : List<Int> = entry.key.split(",").map { it.toInt() }
        val coord = NDimensionalCoordinate(lst.size, lst)
        val state = if (entry.value.asBoolean) State.ALIVE else State.DEAD
        cells[coord] = state
    }
    return Board(cells)
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
//                println(b.cells.size)
//                println("OLD")
//                println(b)
                b.transform(Conway)
//                println("NEW")
//                println(b)
//                println(GSON.toJsonTree(params).asJsonObject["values"])
//                println(params.entries())
//                val json = GSON.toJson(params)
//                println(json)
                val response = boardToJson(b)
//                println(response)
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