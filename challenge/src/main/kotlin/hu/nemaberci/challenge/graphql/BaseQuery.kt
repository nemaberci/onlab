package hu.nemaberci.challenge.graphql

import graphql.kickstart.tools.GraphQLQueryResolver
import graphql.schema.DataFetchingEnvironment
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class BaseQuery: GraphQLQueryResolver {

    @Autowired
    private lateinit var challengeQuery: ChallengeQuery

    fun challenge(env: DataFetchingEnvironment): ChallengeQuery {
        return challengeQuery
    }

}