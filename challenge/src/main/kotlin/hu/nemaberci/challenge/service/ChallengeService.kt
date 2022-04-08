package hu.nemaberci.challenge.service

import hu.nemaberci.challenge.dto.Challenge
import hu.nemaberci.challenge.entity.ChallengeEntity
import hu.nemaberci.challenge.repository.ChallengeRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ChallengeService {

    @Autowired
    private lateinit var challengeRepository: ChallengeRepository

    fun getAllChallenges(): List<Challenge> =
            challengeRepository.findAll().map(Challenge::from)

    fun createChallenge(
            name: String, description: String
    ): Challenge {
        return Challenge.from(
                challengeRepository.save(
                        ChallengeEntity(
                                name = name,
                                description = description
                        )
                )
        )
    }

    fun updateChallenge(
            id: Long, name: String, description: String
    ): Challenge {
        challengeRepository.getById(id).let {
            it.description = description
            it.name = name
            return Challenge.from(
                    challengeRepository.save(
                            it
                    )
            )
        }
    }

    fun deleteChallenge(
            id: Long
    ) {
        challengeRepository.deleteById(id)
    }

    fun exists(id: Long): Boolean = challengeRepository.existsById(id)

    fun byId(id: Long): Challenge =
            Challenge.from(
                    challengeRepository.getById(id)
            )

}