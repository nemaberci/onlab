package hu.nemaberci.comment.message

import hu.nemaberci.comment.CommentApplication
import hu.nemaberci.comment.entity.CommentEntity
import hu.nemaberci.comment.enum.CommentOwnerType
import hu.nemaberci.comment.input.CommentInput
import hu.nemaberci.comment.input.CommentOwnerInput
import hu.nemaberci.comment.service.CommentService
import org.slf4j.LoggerFactory
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class MessageQueueListener {

    @Autowired
    private lateinit var commentService: CommentService

    @RabbitListener(queues = [CommentApplication.message_queue_name])
    fun listen(input: Map<String, String>) {

        LoggerFactory.getLogger(MessageQueueListener::class.java).info("Recieved message in queue")
        LoggerFactory.getLogger(MessageQueueListener::class.java).info("Map keys: ${input.keys}")
        LoggerFactory.getLogger(MessageQueueListener::class.java).info("Map values: ${input.values}")

        if (input.keys.containsAll(listOf(
                "id", "text", "emailAddress"
        ))) {
            commentService.create(
                    CommentInput(
                            input["text"]!!,
                            CommentOwnerInput(
                                    input["id"]?.toLong()!!,
                                    CommentOwnerType.SOLUTION
                            )
                    ),
                    input["emailAddress"]!!
            )
        } else {
            LoggerFactory.getLogger(MessageQueueListener::class.java).error("Keys are missing from message!")
            return
        }

    }

}