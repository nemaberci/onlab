package hu.nemaberci.user.service

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import hu.nemaberci.user.dto.Role
import hu.nemaberci.user.dto.User
import hu.nemaberci.user.entity.RoleEntity
import hu.nemaberci.user.entity.UserEntity
import hu.nemaberci.user.repository.RoleRepository
import hu.nemaberci.user.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*
import javax.annotation.PostConstruct

@Service
class UserService {

    @Value("\${hu.nemaberci.google.client_id}")
    private lateinit var clientId: String

    @Value("\${hu.nemaberci.jwt.secret}")
    private lateinit var jwtSecret: String

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var roleRepository: RoleRepository

    fun createJwt(
            token: String
    ): String {

        val verifier = GoogleIdTokenVerifier.Builder(NetHttpTransport(), GsonFactory())
                .setAudience(listOf(clientId))
                .build()

        val result = verifier.verify(token)
        if (result != null) {
            val optionalUser = userRepository.findFirstByEmailAddress(
                    result.payload.email
            )
            val user = if (optionalUser.isEmpty) {
                userRepository.save(
                        UserEntity(
                                result.payload.email
                        )
                )
            } else {
                optionalUser.get()
            }

            val algorithm = Algorithm.HMAC256(jwtSecret)
            return JWT.create()
                    .withIssuer("userService")
                    .withIssuedAt(Date())
                    .withExpiresAt(Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                    .withPayload(
                            mapOf(
                                    "roles" to user.roles.map { role -> role.name },
                                    "emailAddress" to user.emailAddress
                            )
                    )
                    .sign(algorithm)

        } else {
            throw IllegalArgumentException("Invalid token")
        }

    }

    // fun verifyJwt(jwt: String): DecodedJWT {
//
    //     val algorithm = Algorithm.HMAC256(jwtSecret)
    //     val verifier = JWT.require(algorithm)
    //             .withIssuer("userService")
    //             .build()
    //     return verifier.verify(jwt)
//
    // }

    fun addRole(emailAddress: String?, userId: Long?, role: String) {

        if ((emailAddress == null && userId == null) || (emailAddress != null && userId != null)) {
            throw IllegalArgumentException("Exactly one of emailAddress or userId must be not null!")
        }

        val roleEntity: RoleEntity = roleRepository.getByName(role)

        emailAddress?.let { email ->

            userRepository.save(
                    userRepository.findFirstByEmailAddress(email).get().also { user ->
                        if (!user.roles.contains(roleEntity)) {
                            user.roles.add(roleEntity)
                        }
                    }
            )

        }

        userId?.let { id ->

            userRepository.save(
                    userRepository.getById(id).also { user ->
                        if (!user.roles.contains(roleEntity)) {
                            user.roles.add(roleEntity)
                        }
                    }
            )

        }

    }

    fun deleteRole(emailAddress: String?, userId: Long?, role: String) {

        if ((emailAddress == null && userId == null) || (emailAddress != null && userId != null)) {
            throw IllegalArgumentException("Exactly one of emailAddress or userId must be not null!")
        }

        val roleEntity: RoleEntity = roleRepository.getByName(role)

        emailAddress?.let { email ->

            userRepository.save(
                    userRepository.findFirstByEmailAddress(email).get().also { user ->
                        if (user.roles.contains(roleEntity)) {
                            user.roles.remove(roleEntity)
                        }
                    }
            )

        }

        userId?.let { id ->

            userRepository.save(
                    userRepository.getById(id).also { user ->
                        if (user.roles.contains(roleEntity)) {
                            user.roles.remove(roleEntity)
                        }
                    }
            )

        }

    }

    fun getRoles(id: Long?, emailAddress: String?): List<Role> {

        if ((emailAddress == null && id == null) || (emailAddress != null && id != null)) {
            throw IllegalArgumentException("Exactly one of emailAddress or id must be not null!")
        }

        if (emailAddress == null) {

            return userRepository.getById(id!!).roles.map(Role::from)

        }

        if (id == null) {

            return userRepository.findFirstByEmailAddress(emailAddress).get().roles.map(Role::from)

        }

        // Execution will never get here
        return listOf()

    }

    fun getAllUsers(): List<User> {

        return userRepository.findAll().map(User::from)

    }

}