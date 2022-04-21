package hu.nemaberci.challenge.graphql

import graphql.kickstart.tools.GraphQLQueryResolver
import graphql.schema.DataFetchingEnvironment
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component

@Component
class BaseQuery: GraphQLQueryResolver {

    @Autowired
    private lateinit var challengeQuery: ChallengeQuery

    @PreAuthorize("isAuthenticated() && hasRole('ROLE_CHALLENGE')")
    fun challenge(env: DataFetchingEnvironment): ChallengeQuery {
        return challengeQuery
    }

}