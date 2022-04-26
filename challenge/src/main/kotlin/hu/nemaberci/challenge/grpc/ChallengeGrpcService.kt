package hu.nemaberci.challenge.grpc

import hu.nemaberci.challenge.proto.ChallengeOuterClass
import hu.nemaberci.challenge.proto.ChallengeServiceGrpc
import hu.nemaberci.challenge.service.ChallengeService
import hu.nemaberci.user.proto.User
import hu.nemaberci.user.proto.UserServiceGrpc
import io.grpc.stub.StreamObserver
import net.devh.boot.grpc.client.inject.GrpcClient
import net.devh.boot.grpc.server.service.GrpcService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.task.TaskExecutor
import javax.annotation.PostConstruct

@GrpcService
class ChallengeGrpcService: ChallengeServiceGrpc.ChallengeServiceImplBase() {

    @GrpcClient("userService")
    private lateinit var userServiceBlockingStub: UserServiceGrpc.UserServiceBlockingStub

    @Autowired
    private lateinit var challengeService: ChallengeService

    @Autowired
    private lateinit var taskExecutor: TaskExecutor

    override fun challengeExists(request: ChallengeOuterClass.Id, responseObserver: StreamObserver<ChallengeOuterClass.Exists>) {
        responseObserver.onNext(doesChallengeExist(request.id))
        responseObserver.onCompleted()
    }

    private fun doesChallengeExist(id: Long): ChallengeOuterClass.Exists =
            ChallengeOuterClass.Exists.newBuilder()
                    .setExists(challengeService.exists(id))
                    .build()

    override fun challengeData(request: ChallengeOuterClass.Id, responseObserver: StreamObserver<ChallengeOuterClass.Challenge>) {
        responseObserver.onNext(getChallengeData(request.id))
        responseObserver.onCompleted()
    }

    private fun getChallengeData(id: Long): ChallengeOuterClass.Challenge {
        val challenge = challengeService.byId(id)
        return ChallengeOuterClass.Challenge.newBuilder()
                .setId(challenge.id)
                .setDescription(challenge.description)
                .setName(challenge.name)
                .build()
    }

    override fun challenges(request: ChallengeOuterClass.NoParams, responseObserver: StreamObserver<ChallengeOuterClass.Challenge>) {
        for (challenge in challengeService.getAllChallenges()) {
            responseObserver.onNext(
                    ChallengeOuterClass.Challenge.newBuilder()
                            .setId(challenge.id)
                            .setDescription(challenge.description)
                            .setName(challenge.name)
                            .build()
            )
        }
        responseObserver.onCompleted()
    }

    @PostConstruct
    fun createRoles() {

        taskExecutor.execute {

            val logger = LoggerFactory.getLogger(ChallengeGrpcService::class.java)

            while (true) {

                try {
                    userServiceBlockingStub.registedRole(
                            User.RegisterRole.newBuilder()
                                    .setRole(ChallengeService.CHALLENGE_ROLE)
                                    .build()
                    )
                    logger.info("Registered role ROLE_CHALLENGE")
                    break;
                } catch (e: Exception) {
                    logger.error("Could not register role, trying again in 10 seconds.")
                    Thread.sleep(10000L)
                }

            }


        }

    }

}