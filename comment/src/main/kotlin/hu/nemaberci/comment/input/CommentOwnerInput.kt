package hu.nemaberci.comment.input

import hu.nemaberci.comment.enum.CommentOwnerType

data class CommentOwnerInput (
        var id: Long,
        var type: CommentOwnerType
)