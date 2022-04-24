package hu.nemaberci.comment.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.comment.dto.Comment
import hu.nemaberci.comment.input.CommentOwnerInput
import hu.nemaberci.comment.service.CommentService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.validation.Valid

@Component
class CommentQuery: GraphQLResolver<CommentQuery> {

    @Autowired
    private lateinit var commentService: CommentService

    fun all(): List<Comment> = commentService.getAll()

    fun byOwner(@Valid owner: CommentOwnerInput): List<Comment> = commentService.getByOwner(owner)

    fun byUser(email: String): List<Comment> = commentService.getByUser(email)

    fun byId(id: Long): Comment = commentService.getById(id)

}