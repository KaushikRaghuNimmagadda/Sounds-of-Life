package site

import com.google.gson.Gson
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


val GSON = Gson()

fun mapToBoard(params: Parameters) {

}

fun startServer() {
    embeddedServer(Netty, 4567) {
        routing {
            // set up all routes
            get("/") {
                call.respondText("Hello!", ContentType.Text.Html)
            }
            post("/update") {
                val params = call.receiveParameters()
                mapToBoard(params)
                val json = GSON.toJson(params)
                println(json)
                call.respond(json)
            }
            static ("game") {
                staticRootFolder = File("src/main/resources")
                files("js")
                default("html/game.html")
            }
        }
    }.start(wait=true)
}