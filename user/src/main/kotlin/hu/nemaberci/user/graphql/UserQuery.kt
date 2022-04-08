package hu.nemaberci.user.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.user.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class UserQuery: GraphQLResolver<UserQuery> {

    @Autowired
    private lateinit var userService: UserService

    fun getJwt(token: String): String {
        return userService.createJwt(token)
    }

}