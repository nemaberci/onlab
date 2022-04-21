package hu.nemaberci.user.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.user.dto.Role
import hu.nemaberci.user.dto.User
import hu.nemaberci.user.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class UserQuery: GraphQLResolver<UserQuery> {

    @Autowired
    private lateinit var userService: UserService

    fun getJwt(token: String): String {
        return userService.createJwt(token)
    }

    @PreAuthorize("isAuthenticated() && hasRole('ROLE_ADMIN')")
    fun roles(id: Long?, emailAddress: String?): List<Role> {
        return userService.getRoles(id, emailAddress)
    }

    @PreAuthorize("isAuthenticated() && hasRole('ROLE_ADMIN')")
    fun all(): List<User> {
        return userService.getAllUsers()
    }

}