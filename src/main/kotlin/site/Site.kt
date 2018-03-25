package site

import io.ktor.application.call
import io.ktor.application.install
import io.ktor.content.default
import io.ktor.content.files
import io.ktor.content.static
import io.ktor.content.staticRootFolder
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.routing.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.*
import java.io.File

fun startServer() {
    embeddedServer(Netty, 4567) {
        routing {
            // set up all routes
            get("/") {
                call.respondText("Hello!", ContentType.Text.Html)
            }
            static ("game") {
                staticRootFolder = File("src/main/resources")
                files("js")
                default("html/game.html")
            }
        }
    }.start(wait=true)
}