package hu.nemaberci.solution.grpc

import hu.nemaberci.solution.service.SolutionService
import hu.nemaberci.solution.util.TryAgainUtil
import hu.nemaberci.user.proto.User
import hu.nemaberci.user.proto.UserServiceGrpc
import net.devh.boot.grpc.client.inject.GrpcClient
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.task.TaskExecutor
import org.springframework.stereotype.Component
import javax.annotation.PostConstruct

@Component
class SolutionGrpcService {

    @GrpcClient("userService")
    private lateinit var userServiceBlockingStub: UserServiceGrpc.UserServiceBlockingStub

    @Autowired
    private lateinit var taskExecutor: TaskExecutor

    @PostConstruct
    fun initRole() {

        taskExecutor.execute {

            val logger = LoggerFactory.getLogger(SolutionGrpcService::class.java)
            TryAgainUtil.tryInfinitely(10000L) {
                userServiceBlockingStub.registedRole(
                        User.RegisterRole.newBuilder()
                                .setRole(SolutionService.ROLE_SOLUTION)
                                .build()
                )
            }
            logger.info("Registered role ROLE_SOLUTION")

        }

    }

}