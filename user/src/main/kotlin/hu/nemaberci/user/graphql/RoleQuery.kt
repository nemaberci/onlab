package hu.nemaberci.user.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.user.dto.Role
import hu.nemaberci.user.service.RoleService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class RoleQuery: GraphQLResolver<RoleQuery> {

    @Autowired
    private lateinit var roleService: RoleService

    fun all(): List<Role> =
            roleService.getAllRoles().map(Role::from)

}