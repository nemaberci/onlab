package hu.nemaberci.solution.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.solution.dto.Solution
import hu.nemaberci.solution.service.SolutionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class SolutionQuery: GraphQLResolver<SolutionQuery> {

    @Autowired
    lateinit var solutionService: SolutionService

    fun all(): List<Solution> =
        solutionService.getAll()

    fun byChallenge(id: Long): List<Solution> =
        solutionService.byChallengeId(id)

    fun byId(id: Long): Solution =
            solutionService.byId(id)

    fun byEmail(email: String): List<Solution> =
            solutionService.byEmail(email)

}