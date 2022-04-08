package hu.nemaberci.challenge.entity

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id

@Entity
class ChallengeEntity (

        @Id
        @GeneratedValue
        var id: Long = 0,

        @Column
        var name: String,

        @Column(length = 10_000)
        var description: String

) {

}