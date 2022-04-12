package hu.nemaberci.user.service

import hu.nemaberci.user.entity.RoleEntity
import hu.nemaberci.user.repository.RoleRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RoleService {

    @Autowired
    private lateinit var roleRepository: RoleRepository

    fun createRole(name: String) =
            roleRepository.save(
                    RoleEntity(name)
            )

    fun getAllRoles() =
            roleRepository.findAll()

    fun deleteRole(name: String) =
            roleRepository.deleteByName(name)

}