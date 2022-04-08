package hu.nemaberci.challenge.security.jwt

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.DecodedJWT
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class JwtFilter: OncePerRequestFilter() {

    @Value("\${hu.nemaberci.jwt.secret}")
    lateinit var jwtSecret: String

    fun verifyJwt(jwt: String): DecodedJWT {
        val algorithm = Algorithm.HMAC256(jwtSecret)
        val verifier = JWT.require(algorithm)
                .withIssuer("userService")
                .build()
        return verifier.verify(jwt)
    }

    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {

        try {

            val authHeader = request.getHeader("authorization")
            if (authHeader.startsWith("Token ")) {
                val token = authHeader.replace("Token ", "")
                val jwt = verifyJwt(token)
                SecurityContextHolder.getContext().authentication = PreAuthenticatedAuthenticationToken(
                        jwt.issuer,
                        jwt.getClaim("emailAddress").asString(),
                        jwt.getClaim("roles").asList(String::class.java).map {
                            SimpleGrantedAuthority(it)
                        }.toMutableList()
                )
            }

        } catch (e: Exception) {
            return
        }

        filterChain.doFilter(request, response)

    }
}