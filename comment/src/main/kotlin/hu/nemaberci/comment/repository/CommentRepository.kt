package hu.nemaberci.comment.repository

import hu.nemaberci.comment.entity.CommentEntity
import hu.nemaberci.comment.enum.CommentOwnerType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CommentRepository: JpaRepository<CommentEntity, Long> {
    fun getAllByOwnerIdAndOwnerType(ownerId: Long, ownerType: CommentOwnerType): List<CommentEntity>
    fun getAllByCreatedBy(createdBy: String): List<CommentEntity>
}