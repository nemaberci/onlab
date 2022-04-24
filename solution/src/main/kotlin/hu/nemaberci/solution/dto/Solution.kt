package hu.nemaberci.solution.dto

import hu.nemaberci.solution.entity.SolutionEntity


data class Solution(
        val id: Long,
        var language: String,
        var content: String,
        var challengeId: Long,
        var result: Boolean,
        val createdBy: String,
        val reviewedBy: String?,
        val points: Int?
) {
    companion object {
        fun from(entity: SolutionEntity): Solution =
                Solution(
                        entity.id,
                        entity.language,
                        entity.content,
                        entity.challengeId,
                        entity.result,
                        entity.createdBy,
                        entity.reviewedBy,
                        entity.points
                )
    }
}