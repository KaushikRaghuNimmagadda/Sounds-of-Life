package site

import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.routing.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.*

fun demo() {
    embeddedServer(Netty, 4567) {
        routing {
            get("/") {
                call.respondText("Hello!", ContentType.Text.Html)
            }
        }
    }.start(wait=true)
}