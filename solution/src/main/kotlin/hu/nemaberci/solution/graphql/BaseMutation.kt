package hu.nemaberci.solution.graphql

import graphql.kickstart.tools.GraphQLMutationResolver
import hu.nemaberci.solution.service.SolutionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component

@Component
class BaseMutation: GraphQLMutationResolver {

    @Autowired
    lateinit var solutionMutation: SolutionMutation

    @PreAuthorize("isAuthenticated() && hasRole('${SolutionService.ROLE_SOLUTION}')")
    fun solution() = solutionMutation

}