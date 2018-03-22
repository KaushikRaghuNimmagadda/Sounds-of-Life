package site

import io.ktor.application.call
import io.ktor.application.install
import io.ktor.content.default
import io.ktor.content.static
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.routing.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.*

fun startServer() {
    embeddedServer(Netty, 4567) {
        routing {
            // set up all routes
            get("/") {
                call.respondText("Hello!", ContentType.Text.Html)
            }
            static ("game") {
                default("src/main/resources/html/game.html")
            }
        }
    }.start(wait=true)
}