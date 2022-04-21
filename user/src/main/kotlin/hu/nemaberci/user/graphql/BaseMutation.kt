package hu.nemaberci.user.graphql

import graphql.kickstart.tools.GraphQLMutationResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component

@Component
class BaseMutation: GraphQLMutationResolver {

    @Autowired
    private lateinit var userMutation: UserMutation

    @PreAuthorize("isAuthenticated() && hasRole('ROLE_ADMIN')")
    fun user(): UserMutation {
        return userMutation
    }

}