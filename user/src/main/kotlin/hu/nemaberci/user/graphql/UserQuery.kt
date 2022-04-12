package hu.nemaberci.user.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.user.dto.Role
import hu.nemaberci.user.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
class UserQuery: GraphQLResolver<UserQuery> {

    @Autowired
    private lateinit var userService: UserService

    @Transactional
    fun getJwt(token: String): String {
        return userService.createJwt(token)
    }

    fun roles(id: Long?, emailAddress: String?): List<Role> {
        return userService.getRoles(id, emailAddress)
    }

}