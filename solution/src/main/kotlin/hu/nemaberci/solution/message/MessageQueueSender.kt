package hu.nemaberci.solution.message

import hu.nemaberci.solution.SolutionApplication
import hu.nemaberci.solution.grpc.SolutionGrpcService
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component

@Component
class MessageQueueSender {

    @Autowired
    lateinit var rabbitTemplate: RabbitTemplate

    fun createMessage(solutionId: Long, text: String) {

        rabbitTemplate.convertAndSend(
                SolutionApplication.message_queue_name,
                mapOf(
                        "id" to solutionId.toString(),
                        "text" to text,
                        "emailAddress" to SecurityContextHolder.getContext().authentication.credentials as String
                )
        )

    }

}