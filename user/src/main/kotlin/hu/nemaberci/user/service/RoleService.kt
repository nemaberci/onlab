package hu.nemaberci.user.service

import hu.nemaberci.user.entity.RoleEntity
import hu.nemaberci.user.entity.UserEntity
import hu.nemaberci.user.repository.RoleRepository
import hu.nemaberci.user.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct

@Service
class RoleService {

    @Autowired
    private lateinit var roleRepository: RoleRepository

    @Autowired
    private lateinit var userRepository: UserRepository

    @Value("\${hu.nemaberci.admin_email}")
    private lateinit var adminEmail: String

    fun createRole(name: String) =
            roleRepository.save(
                    RoleEntity(name)
            )

    fun getAllRoles() =
            roleRepository.findAll()

    fun deleteRole(name: String) =
            roleRepository.deleteByName(name)

    @PostConstruct
    fun init() {
        val adminRoleOptional = roleRepository.findAll().find { role -> role.name == "ROLE_ADMIN" }
        lateinit var adminRole: RoleEntity

        if (adminRoleOptional == null) {
            adminRole = roleRepository.save(
                    RoleEntity(
                            "ROLE_ADMIN"
                    )
            )
        } else {
            adminRole = adminRoleOptional
        }

        val optionalUserEntity = userRepository.findFirstByEmailAddress(adminEmail)
        lateinit var userEntity: UserEntity
        if (optionalUserEntity.isEmpty) {
            userEntity = userRepository.save(
                    UserEntity(adminEmail)
            )
        } else {
            userEntity = optionalUserEntity.get()
        }
        if (userEntity.roles.find { role -> role.name == "ROLE_ADMIN" } == null) {
            userEntity.roles.add(adminRole)
        }

        userRepository.save(userEntity)
    }

}