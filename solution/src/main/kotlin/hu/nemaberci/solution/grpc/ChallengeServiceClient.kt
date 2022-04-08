package hu.nemaberci.solution.grpc

import hu.nemaberci.challenge.proto.ChallengeOuterClass
import hu.nemaberci.challenge.proto.ChallengeServiceGrpc
import net.devh.boot.grpc.client.inject.GrpcClient
import org.springframework.stereotype.Service

@Service
class ChallengeServiceClient {

    @GrpcClient("challengeService")
    private lateinit var challengeServiceBlockingStub: ChallengeServiceGrpc.ChallengeServiceBlockingStub

    fun challengeExistsById(id: Long): Boolean =
            challengeServiceBlockingStub.challengeExists(
                    ChallengeOuterClass.Id.newBuilder()
                            .setId(id)
                            .build()
            ).exists

}