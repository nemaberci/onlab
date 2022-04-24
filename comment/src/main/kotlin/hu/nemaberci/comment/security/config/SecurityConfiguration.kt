package hu.nemaberci.comment.security.config

import hu.nemaberci.comment.security.jwt.JwtFilter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfiguration: WebSecurityConfigurerAdapter() {

    @Autowired
    private lateinit var jwtFilter: JwtFilter

    override fun configure(http: HttpSecurity) {
        http.csrf().disable()
                .authorizeRequests().antMatchers("**/graphql/**").permitAll()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter::class.java)
    }

}