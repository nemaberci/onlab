package hu.nemaberci.comment.graphql

import graphql.kickstart.tools.GraphQLQueryResolver
import hu.nemaberci.comment.service.CommentService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component

@Component
class BaseQuery: GraphQLQueryResolver {

    @Autowired
    private lateinit var commentQuery: CommentQuery

    @PreAuthorize("isAuthenticated() && hasRole('${CommentService.ROLE_COMMENT}')")
    fun comment() = commentQuery

}