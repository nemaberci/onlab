package hu.nemaberci.solution.grpc

import hu.nemaberci.challenge.proto.ChallengeOuterClass
import hu.nemaberci.challenge.proto.ChallengeServiceGrpc
import hu.nemaberci.solution.util.TryAgainUtil
import net.devh.boot.grpc.client.inject.GrpcClient
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ChallengeServiceClient {

    @GrpcClient("challengeService")
    private lateinit var challengeServiceBlockingStub: ChallengeServiceGrpc.ChallengeServiceBlockingStub

    fun challengeExistsById(id: Long): Boolean =
            TryAgainUtil.tryMultiple {
                challengeServiceBlockingStub.challengeExists(
                        ChallengeOuterClass.Id.newBuilder()
                                .setId(id)
                                .build()
                )
            }?.exists ?: false.also {
                val logger = LoggerFactory.getLogger(ChallengeServiceClient::class.java)
                logger.error("Could not execute challengeGRPC call")
            }

}