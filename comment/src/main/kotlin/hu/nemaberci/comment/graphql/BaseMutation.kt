package hu.nemaberci.comment.graphql

import graphql.kickstart.tools.GraphQLMutationResolver
import graphql.schema.DataFetchingEnvironment
import hu.nemaberci.comment.service.CommentService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component

@Component
class BaseMutation: GraphQLMutationResolver {

    @Autowired
    private lateinit var commentMutation: CommentMutation

    @PreAuthorize("isAuthenticated() && hasRole('${CommentService.ROLE_COMMENT}')")
    fun comment() = commentMutation

}