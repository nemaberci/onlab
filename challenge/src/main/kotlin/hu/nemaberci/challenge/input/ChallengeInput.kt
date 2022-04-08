package hu.nemaberci.challenge.input

import javax.validation.constraints.Size

data class ChallengeInput(
        @field:Size(min = 1, max = 255)
        val name: String,

        @field:Size(min = 0, max = 10_000)
        val description: String
)
