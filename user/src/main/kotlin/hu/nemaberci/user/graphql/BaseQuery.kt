package hu.nemaberci.user.graphql

import graphql.kickstart.tools.GraphQLQueryResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class BaseQuery: GraphQLQueryResolver {

    @Autowired
    private lateinit var userQuery: UserQuery

    @Autowired
    private lateinit var roleQuery: RoleQuery

    fun user(): UserQuery {
        return userQuery;
    }

    fun role(): RoleQuery {
        return roleQuery
    }

}