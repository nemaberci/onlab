package hu.nemaberci.comment.service

import hu.nemaberci.comment.dto.Comment
import hu.nemaberci.comment.entity.CommentEntity
import hu.nemaberci.comment.input.CommentInput
import hu.nemaberci.comment.input.CommentOwnerInput
import hu.nemaberci.comment.repository.CommentRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class CommentService {

    @Autowired
    private lateinit var commentRepository: CommentRepository

    fun getAll(): List<Comment> =
            commentRepository.findAll().map(Comment::from)

    fun getById(id: Long): Comment =
            Comment.from(commentRepository.getById(id))

    fun getByOwner(owner: CommentOwnerInput): List<Comment> =
            commentRepository.getAllByOwnerIdAndOwnerType(
                    owner.id,
                    owner.type
            ).map(Comment::from)

    fun getByUser(email: String): List<Comment> =
            commentRepository.getAllByCreatedBy(email).map(Comment::from)

    fun create(input: CommentInput, creator: String? = null): Comment {
        var entity = CommentEntity(
                createdBy = creator ?: SecurityContextHolder.getContext().authentication.credentials as String,
                text = input.text,
                ownerId = input.owner.id,
                ownerType = input.owner.type
        )
        entity = commentRepository.save(entity)
        return Comment.from(entity)
    }

    fun update(id: Long, text: String): Comment {
        var entity = commentRepository.getById(id)
        entity.text = text
        entity = commentRepository.save(entity)
        return Comment.from(entity)
    }

    fun delete(id: Long): Unit =
            commentRepository.deleteById(id)

    companion object {
        const val ROLE_COMMENT = "ROLE_COMMENT"
    }

}