package hu.nemaberci.solution.service

import hu.nemaberci.solution.dto.Solution
import hu.nemaberci.solution.entity.SolutionEntity
import hu.nemaberci.solution.grpc.ChallengeServiceClient
import hu.nemaberci.solution.input.SolutionInput
import hu.nemaberci.solution.repository.SolutionRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct

@Service
class SolutionService {

    @Autowired
    lateinit var solutionRepository: SolutionRepository

    @Autowired
    private lateinit var challengeServiceClient: ChallengeServiceClient

    fun getAll(): List<Solution> =
            solutionRepository.findAll().map(Solution::from)

    fun create(solutionInput: SolutionInput): Solution {
        if (!challengeServiceClient.challengeExistsById(solutionInput.challengeId)) {
            throw IllegalArgumentException("Challenge does not exist by id ${solutionInput.challengeId}")
        }
        return Solution.from(
                solutionRepository.save(
                        SolutionEntity(
                                id = 0,
                                challengeId = solutionInput.challengeId,
                                language = solutionInput.language,
                                content = solutionInput.content,
                                result = false
                        )
                )
        )
    }

    fun update(id: Long, solutionInput: SolutionInput): Solution {
        if (!challengeServiceClient.challengeExistsById(solutionInput.challengeId)) {
            throw IllegalArgumentException("Challenge does not exist by id ${solutionInput.challengeId}")
        }
        return solutionRepository.getById(id).let {
            it.content = solutionInput.content
            it.challengeId = solutionInput.challengeId
            it.language = solutionInput.language
            return@let Solution.from(
                    solutionRepository.save(it)
            )
        }
    }

    fun delete(id: Long) =
            solutionRepository.deleteById(id)

    fun byChallengeId(challengeId: Long): List<Solution> =
            solutionRepository.findAllByChallengeId(challengeId).map(Solution::from)

    @PostConstruct
    fun init() {
        println("Hello world!")
    }

}