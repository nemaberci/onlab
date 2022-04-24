package hu.nemaberci.challenge.graphql

import graphql.kickstart.tools.GraphQLQueryResolver
import graphql.schema.DataFetchingEnvironment
import hu.nemaberci.challenge.service.ChallengeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component

@Component
class BaseQuery: GraphQLQueryResolver {

    @Autowired
    private lateinit var challengeQuery: ChallengeQuery

    @PreAuthorize("isAuthenticated() && hasRole('${ChallengeService.CHALLENGE_ROLE}')")
    fun challenge(env: DataFetchingEnvironment): ChallengeQuery {
        return challengeQuery
    }

}