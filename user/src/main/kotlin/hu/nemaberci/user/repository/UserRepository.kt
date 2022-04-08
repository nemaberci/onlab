package hu.nemaberci.user.repository

import hu.nemaberci.user.entity.UserEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository: JpaRepository<UserEntity, Long> {
    fun findFirstByEmailAddress(emailAddress: String): Optional<UserEntity>
}