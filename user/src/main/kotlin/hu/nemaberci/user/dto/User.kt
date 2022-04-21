package hu.nemaberci.user.dto

import hu.nemaberci.user.entity.UserEntity

data class User(
        val id: Long,
        val emailAddress: String,
        val roles: List<Role>
) {
    companion object {
        fun from(userEntity: UserEntity): User =
                User(
                        id = userEntity.id,
                        emailAddress = userEntity.emailAddress,
                        roles = userEntity.roles.map(Role::from)
                )
    }
}