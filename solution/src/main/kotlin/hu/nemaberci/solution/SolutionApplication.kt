package hu.nemaberci.solution

import org.springframework.amqp.core.Queue
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class SolutionApplication {

    companion object {
        const val message_queue_name = "solution-comment-message"
    }

    @Bean
    fun queue(): Queue = Queue(message_queue_name, false)

    @Bean
    fun rabbitTemplate(connectionFactory: ConnectionFactory): RabbitTemplate {
        val template = RabbitTemplate(connectionFactory)
        template.messageConverter = Jackson2JsonMessageConverter()
        return template
    }

}

fun main(args: Array<String>) {
    runApplication<SolutionApplication>(*args)
}
