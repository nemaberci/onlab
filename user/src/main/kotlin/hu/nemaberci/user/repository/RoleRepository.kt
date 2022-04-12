package hu.nemaberci.user.repository

import hu.nemaberci.user.entity.RoleEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RoleRepository: JpaRepository<RoleEntity, Long> {
    fun deleteByName(name: String)
    fun getByName(name: String): RoleEntity
}