package hu.nemaberci.user.entity

import javax.persistence.*

@Entity
class UserEntity(email: String) {

    @Id
    @GeneratedValue
    var id: Long = 0;

    @Column(unique = true)
    var emailAddress: String = email;

    @ManyToMany
    var roles: MutableList<RoleEntity> = mutableListOf();

}