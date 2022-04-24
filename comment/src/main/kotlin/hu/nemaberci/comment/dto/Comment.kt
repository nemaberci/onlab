package hu.nemaberci.comment.dto

import hu.nemaberci.comment.entity.CommentEntity

data class Comment (
        val id: Long,
        val text: String,
        val createdBy: String,
        val owner: CommentOwner
) {
    companion object {
        fun from(commentEntity: CommentEntity): Comment =
                Comment(
                        id = commentEntity.id,
                        text = commentEntity.text,
                        createdBy = commentEntity.createdBy,
                        owner = CommentOwner(
                                id = commentEntity.ownerId,
                                type = commentEntity.ownerType
                        )
                )
    }
}