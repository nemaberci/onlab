package hu.nemaberci.challenge.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.challenge.dto.Challenge
import hu.nemaberci.challenge.service.ChallengeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class ChallengeQuery: GraphQLResolver<ChallengeQuery> {

    @Autowired
    private lateinit var challengeService: ChallengeService

    fun all(): List<Challenge> {
        return challengeService.getAllChallenges()
    }

    fun byId(id: Long): Challenge = challengeService.byId(id)

    fun byEmail(email: String): List<Challenge> = challengeService.byEmail(email)

}