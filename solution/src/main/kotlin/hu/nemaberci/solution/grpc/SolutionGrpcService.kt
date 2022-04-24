package hu.nemaberci.solution.grpc

import hu.nemaberci.solution.service.SolutionService
import hu.nemaberci.user.proto.User
import hu.nemaberci.user.proto.UserServiceGrpc
import net.devh.boot.grpc.client.inject.GrpcClient
import org.springframework.stereotype.Component
import javax.annotation.PostConstruct

@Component
class SolutionGrpcService {

    @GrpcClient("userService")
    private lateinit var userServiceBlockingStub: UserServiceGrpc.UserServiceBlockingStub

    @PostConstruct
    fun initRole() {

        userServiceBlockingStub.registedRole(
                User.RegisterRole.newBuilder()
                        .setRole(SolutionService.ROLE_SOLUTION)
                        .build()
        )

    }

}