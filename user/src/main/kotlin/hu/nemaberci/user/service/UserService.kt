package hu.nemaberci.user.service

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.DecodedJWT
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import hu.nemaberci.user.entity.UserEntity
import hu.nemaberci.user.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService {

    @Value("\${hu.nemaberci.google.client_id}")
    lateinit var clientId: String

    @Value("\${hu.nemaberci.jwt.secret}")
    lateinit var jwtSecret: String

    @Autowired
    lateinit var userRepository: UserRepository

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
                                    "roles" to user.roles,
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

        emailAddress?.let { email ->

            userRepository.save(
                    userRepository.findFirstByEmailAddress(email).get().also { user ->
                        if (!user.roles.contains(role)) {
                            user.roles.add(role)
                        }
                    }
            )

        }

        userId?.let { id ->

            userRepository.save(
                    userRepository.getById(id).also { user ->
                        if (!user.roles.contains(role)) {
                            user.roles.add(role)
                        }
                    }
            )

        }

    }

    fun deleteRole(emailAddress: String?, userId: Long?, role: String) {

        if ((emailAddress == null && userId == null) || (emailAddress != null && userId != null)) {
            throw IllegalArgumentException("Exactly one of emailAddress or userId must be not null!")
        }

        emailAddress?.let { email ->

            userRepository.save(
                    userRepository.findFirstByEmailAddress(email).get().also { user ->
                        if (user.roles.contains(role)) {
                            user.roles.remove(role)
                        }
                    }
            )

        }

        userId?.let { id ->

            userRepository.save(
                    userRepository.getById(id).also { user ->
                        if (user.roles.contains(role)) {
                            user.roles.remove(role)
                        }
                    }
            )

        }

    }

}