package hu.nemaberci.challenge.dto

import hu.nemaberci.challenge.entity.ChallengeEntity

data class Challenge(
        val id: Long,
        val name: String,
        val description: String,
        val createdBy: String
) {
    companion object {
        fun from(challengeEntity: ChallengeEntity): Challenge {
            return Challenge(
                    challengeEntity.id,
                    challengeEntity.name,
                    challengeEntity.description,
                    challengeEntity.createdBy
            )
        }
    }
}
