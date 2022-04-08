package hu.nemaberci.solution.graphql

import graphql.kickstart.tools.GraphQLQueryResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class BaseQuery: GraphQLQueryResolver {

    @Autowired
    lateinit var solutionQuery: SolutionQuery

    fun solution() = solutionQuery

}