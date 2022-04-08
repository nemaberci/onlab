package hu.nemaberci.solution.graphql

import graphql.kickstart.tools.GraphQLMutationResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class BaseMutation: GraphQLMutationResolver {

    @Autowired
    lateinit var solutionMutation: SolutionMutation

    fun solution() = solutionMutation

}