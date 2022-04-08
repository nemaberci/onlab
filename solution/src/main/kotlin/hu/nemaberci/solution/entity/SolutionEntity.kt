package hu.nemaberci.solution.entity

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id

@Entity
class SolutionEntity(

        @Id
        @GeneratedValue
        var id: Long = 0,

        @Column
        var language: String,

        @Column(length = 100_000)
        var content: String,

        @Column
        var challengeId: Long,

        @Column
        var result: Boolean

) {

}