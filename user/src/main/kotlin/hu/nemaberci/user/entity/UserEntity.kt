package hu.nemaberci.user.entity

import javax.persistence.*

@Entity
class UserEntity(email: String) {

    @Id
    @GeneratedValue
    var id: Long = 0;

    @Column(unique = true)
    var emailAddress: String = email;

    @ElementCollection(fetch = FetchType.EAGER)
    var roles: MutableList<String> = mutableListOf();

}