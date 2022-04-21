package hu.nemaberci.challenge.entity

import org.springframework.data.annotation.CreatedBy
import org.springframework.security.core.userdetails.User
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
        var description: String,

        @Column(length = 255)
        var createdBy: String = ""

) {

}