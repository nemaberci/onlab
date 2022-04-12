package hu.nemaberci.user.entity

import javax.persistence.*

@Entity
class RoleEntity(@Column(unique = true) var name: String) {
    @Id
    @GeneratedValue
    var id: Long = 0;
}