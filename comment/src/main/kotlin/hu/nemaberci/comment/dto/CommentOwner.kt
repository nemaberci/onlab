package hu.nemaberci.comment.dto

import hu.nemaberci.comment.enum.CommentOwnerType

data class CommentOwner (
        val id: Long,
        val type: CommentOwnerType
)