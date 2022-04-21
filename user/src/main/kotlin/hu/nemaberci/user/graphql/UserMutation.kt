package hu.nemaberci.user.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.user.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class UserMutation: GraphQLResolver<UserMutation> {

    @Autowired
    private lateinit var userService: UserService

    fun addRole(emailAddress: String?, id: Long?, role: String): Boolean {
        userService.addRole(emailAddress, id, role)
        return true
    }

    fun deleteRole(emailAddress: String?, id: Long?, role: String): Boolean {
        userService.deleteRole(emailAddress, id, role)
        return true
    }

}