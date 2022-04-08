package hu.nemaberci.challenge.grpc

import hu.nemaberci.challenge.proto.ChallengeOuterClass
import hu.nemaberci.challenge.proto.ChallengeServiceGrpc
import hu.nemaberci.challenge.service.ChallengeService
import io.grpc.stub.StreamObserver
import net.devh.boot.grpc.server.service.GrpcService
import org.springframework.beans.factory.annotation.Autowired

@GrpcService
class ChallengeGrpcService: ChallengeServiceGrpc.ChallengeServiceImplBase() {

    @Autowired
    lateinit var challengeService: ChallengeService

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

}