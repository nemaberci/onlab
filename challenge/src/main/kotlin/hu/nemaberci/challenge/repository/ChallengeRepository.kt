package hu.nemaberci.challenge.repository

import hu.nemaberci.challenge.entity.ChallengeEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ChallengeRepository: JpaRepository<ChallengeEntity, Long> {
    fun findAllByCreatedBy(createdBy: String): List<ChallengeEntity>
}