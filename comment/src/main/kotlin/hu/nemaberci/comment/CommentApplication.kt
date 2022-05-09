package hu.nemaberci.comment

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CommentApplication {

    companion object {
        const val message_queue_name = "solution-comment-message"
    }

}

fun main(args: Array<String>) {
    runApplication<CommentApplication>(*args)
}
