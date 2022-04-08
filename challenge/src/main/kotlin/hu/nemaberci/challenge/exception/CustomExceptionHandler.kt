package hu.nemaberci.challenge.exception

import graphql.ExceptionWhileDataFetching
import graphql.GraphQLError
import graphql.kickstart.execution.error.GraphQLErrorHandler
import org.springframework.stereotype.Component

@Component
class CustomExceptionHandler: GraphQLErrorHandler {

    override fun processErrors(errors: MutableList<GraphQLError>?): MutableList<GraphQLError>? {
        errors?.map {
            if (ExceptionWhileDataFetching::class.isInstance(it)) {
                return@map (it as ExceptionWhileDataFetching).exception
            } else {
                return@map it
            }
        }
        return errors
    }
}