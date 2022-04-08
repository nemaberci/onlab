package hu.nemaberci.challenge.graphql

import graphql.kickstart.tools.GraphQLMutationResolver
import graphql.schema.DataFetchingEnvironment
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class BaseMutation: GraphQLMutationResolver {

    @Autowired
    private lateinit var challengeMutation: ChallengeMutation

    fun challenge(env: DataFetchingEnvironment): ChallengeMutation {
        return challengeMutation
    }

}