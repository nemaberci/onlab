package hu.nemaberci.solution.graphql

import graphql.kickstart.tools.GraphQLResolver
import hu.nemaberci.solution.input.ReviewInput
import hu.nemaberci.solution.input.SolutionInput
import hu.nemaberci.solution.service.SolutionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.validation.annotation.Validated
import javax.validation.Valid

@Component
@Validated
class SolutionMutation : GraphQLResolver<SolutionMutation> {

    @Autowired
    lateinit var solutionService: SolutionService

    fun create(@Valid solution: SolutionInput) =
            solutionService.create(solution)

    fun update(id: Long, @Valid solution: SolutionInput) =
            solutionService.update(id, solution)

    fun delete(id: Long) =
            solutionService.delete(id)

    fun review(id: Long, @Valid reviewInput: ReviewInput) =
            solutionService.review(id, reviewInput)

}