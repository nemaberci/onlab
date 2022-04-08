package hu.nemaberci.solution.input

import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

data class SolutionInput(
    @field:Size(min = 1, max = 50)
    @field:NotBlank
    var language: String,
    @field:Size(min = 1, max = 100_000)
    @field:NotBlank
    var content: String,
    var challengeId: Long
)