package hu.nemaberci.comment.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.comment.dto.Comment
import hu.nemaberci.comment.input.CommentInput
import hu.nemaberci.comment.service.CommentService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.validation.Valid

@Component
class CommentMutation: GraphQLResolver<CommentMutation> {

    @Autowired
    private lateinit var commentService: CommentService

    fun create(@Valid comment: CommentInput): Comment = commentService.create(comment)

    fun update(id: Long, text: String): Comment = commentService.update(id, text)

    fun delete(id: Long): Boolean {
        commentService.delete(id)
        return true
    }

}