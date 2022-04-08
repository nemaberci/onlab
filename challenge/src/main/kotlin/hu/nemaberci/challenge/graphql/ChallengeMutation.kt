package hu.nemaberci.challenge.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.challenge.dto.Challenge
import hu.nemaberci.challenge.input.ChallengeInput
import hu.nemaberci.challenge.service.ChallengeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.validation.annotation.Validated
import javax.validation.Valid

@Component
@Validated
class ChallengeMutation: GraphQLResolver<ChallengeMutation> {

    @Autowired
    private lateinit var challengeService: ChallengeService

    fun create(@Valid challengeInput: ChallengeInput): Challenge {
        return challengeService.createChallenge(challengeInput.name, challengeInput.description)
    }

    fun update(
            id: Long,
            @Valid challengeInput: ChallengeInput
    ): Challenge {
        return challengeService.updateChallenge(
                id,
                challengeInput.name,
                challengeInput.description
        )
    }

    fun delete(
            id: Long
    ): Boolean {
        challengeService.deleteChallenge(id)
        return true
    }

}