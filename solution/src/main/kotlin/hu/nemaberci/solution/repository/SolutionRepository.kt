package hu.nemaberci.solution.repository

import hu.nemaberci.solution.entity.SolutionEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SolutionRepository: JpaRepository<SolutionEntity, Long> {
    fun findAllByChallengeId(challengeId: Long): List<SolutionEntity>
}