package hu.nemaberci.comment.input

import javax.validation.constraints.Size

data class CommentInput (
        @field:Size(min = 1, max = 100_000)
        var text: String,
        var owner: CommentOwnerInput
)