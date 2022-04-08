package hu.nemaberci.user.graphql

import graphql.kickstart.tools.GraphQLMutationResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class BaseMutation: GraphQLMutationResolver {

    @Autowired
    private lateinit var userMutation: UserMutation

    fun user(): UserMutation {
        return userMutation
    }

}