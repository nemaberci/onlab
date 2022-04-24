package hu.nemaberci.solution.input

import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

data class ReviewInput (
    @field:NotNull
    var points: Int,
    @field:Size(min = 0, max = 1_000)
    var comment: String?,
    var result: Boolean
)