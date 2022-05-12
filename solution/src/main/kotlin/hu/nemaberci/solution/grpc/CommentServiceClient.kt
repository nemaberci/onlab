package hu.nemaberci.solution.grpc

import hu.nemaberci.comment.proto.CommentOuterClass
import hu.nemaberci.comment.proto.CommentServiceGrpc
import hu.nemaberci.solution.util.TryAgainUtil
import net.devh.boot.grpc.client.inject.GrpcClient
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class CommentServiceClient {

    @GrpcClient("commentService")
    private lateinit var commentServiceBlockingStub: CommentServiceGrpc.CommentServiceBlockingStub

    fun createComment(solutionId: Long, text: String) {

        TryAgainUtil.tryMultiple {
            commentServiceBlockingStub.create(
                    CommentOuterClass.CommentInput.newBuilder()
                            .setCreatedBy(
                                    SecurityContextHolder.getContext().authentication.credentials as String
                            )
                            .setOwner(
                                    CommentOuterClass.Owner.newBuilder()
                                            .setOwnerType(CommentOuterClass.CommentOwner.SOLUTION)
                                            .setOwnerId(solutionId)
                                            .build()
                            )
                            .setText(text)
                            .build()
            )
        }

    }

}