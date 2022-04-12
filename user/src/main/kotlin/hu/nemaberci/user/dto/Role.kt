package hu.nemaberci.user.dto

import hu.nemaberci.user.entity.RoleEntity

data class Role(
        val id: Long,
        val name: String
) {
    companion object {
        fun from(roleEntity: RoleEntity): Role =
                Role(name = roleEntity.name, id = roleEntity.id)
    }
}
