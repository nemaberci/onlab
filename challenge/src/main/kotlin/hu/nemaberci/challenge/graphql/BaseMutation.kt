package hu.nemaberci.challenge.graphql

import graphql.kickstart.tools.GraphQLMutationResolver
import graphql.schema.DataFetchingEnvironment
import hu.nemaberci.challenge.service.ChallengeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component

@Component
class BaseMutation: GraphQLMutationResolver {

    @Autowired
    private lateinit var challengeMutation: ChallengeMutation

    @PreAuthorize("isAuthenticated() && hasRole('ROLE_CHALLENGE')")
    fun challenge(env: DataFetchingEnvironment): ChallengeMutation {
        return challengeMutation
    }

}