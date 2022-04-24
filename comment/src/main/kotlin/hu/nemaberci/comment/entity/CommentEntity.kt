package hu.nemaberci.comment.entity

import hu.nemaberci.comment.enum.CommentOwnerType
import javax.persistence.*

@Entity
class CommentEntity (

        @Id
        @GeneratedValue
        var id: Long = 0,

        @Column(length = 100_000)
        var text: String,

        @Column
        var createdBy: String,

        @Column
        var ownerId: Long,

        @Column
        var ownerType: CommentOwnerType

)