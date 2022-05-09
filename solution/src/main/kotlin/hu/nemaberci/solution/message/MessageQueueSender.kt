package hu.nemaberci.solution.message

import hu.nemaberci.solution.SolutionApplication
import hu.nemaberci.solution.entity.SolutionEntity
import hu.nemaberci.solution.grpc.SolutionGrpcService
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component

@Component
class MessageQueueSender {

    @Autowired
    lateinit var rabbitTemplate: RabbitTemplate

    fun createMessage(solution: SolutionEntity, text: String?) {

        val sentText = text ?: ""

        rabbitTemplate.convertAndSend(
                SolutionApplication.message_queue_name,
                mapOf(
                        "to" to solution.createdBy,
                        "text" to sentText,
                        "reviewedBy" to SecurityContextHolder.getContext().authentication.credentials as String
                )
        )

    }

}