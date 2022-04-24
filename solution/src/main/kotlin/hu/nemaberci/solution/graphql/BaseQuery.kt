package hu.nemaberci.solution.graphql

import graphql.kickstart.tools.GraphQLQueryResolver
import hu.nemaberci.solution.service.SolutionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component

@Component
class BaseQuery: GraphQLQueryResolver {

    @Autowired
    lateinit var solutionQuery: SolutionQuery

    @PreAuthorize("isAuthenticated() && hasRole('${SolutionService.ROLE_SOLUTION}')")
    fun solution() = solutionQuery

}