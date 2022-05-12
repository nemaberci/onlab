package hu.nemaberci.challenge.service

import hu.nemaberci.challenge.dto.Challenge
import hu.nemaberci.challenge.entity.ChallengeEntity
import hu.nemaberci.challenge.repository.ChallengeRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class ChallengeService {

    @Autowired
    private lateinit var challengeRepository: ChallengeRepository

    private fun hasAccess(entity: ChallengeEntity): Boolean = entity.createdBy == SecurityContextHolder.getContext().authentication.credentials as String ||
                SecurityContextHolder.getContext().authentication.authorities.any { authority -> authority.authority == "ROLE_ADMIN" }


    fun getAllChallenges(): List<Challenge> =
            challengeRepository.findAll().map(Challenge::from)

    fun createChallenge(
            name: String, description: String
    ): Challenge {
        return Challenge.from(
                challengeRepository.save(
                        ChallengeEntity(
                                name = name,
                                description = description,
                                createdBy = SecurityContextHolder.getContext().authentication.credentials as String
                        )
                )
        )
    }

    fun updateChallenge(
            id: Long, name: String, description: String
    ): Challenge {
        val challengeToUpdate = challengeRepository.getById(id)
        if (hasAccess(challengeToUpdate)) {
            challengeToUpdate.description = description
            challengeToUpdate.name = name
            return Challenge.from(
                    challengeRepository.save(
                            challengeToUpdate
                    )
            )
        } else {
            throw IllegalArgumentException("Current user cannot update this challenge")
        }
    }

    fun deleteChallenge(
            id: Long
    ) {
        val challengeToDelete = challengeRepository.getById(id)
        if (hasAccess(challengeToDelete)) {
            challengeRepository.delete(challengeToDelete)
        } else {
            throw IllegalArgumentException("Current user cannot delete this challenge")
        }
    }

    fun exists(id: Long): Boolean = challengeRepository.existsById(id)

    fun byId(id: Long): Challenge =
            Challenge.from(
                    challengeRepository.getById(id)
            )

    fun byEmail(email: String): List<Challenge> =
            challengeRepository.findAllByCreatedBy(email).map(Challenge::from)

    companion object {
        const val CHALLENGE_ROLE = "ROLE_CHALLENGE"
    }

}