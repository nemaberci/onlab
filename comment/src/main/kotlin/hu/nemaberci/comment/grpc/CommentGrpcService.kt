package hu.nemaberci.comment.grpc

import hu.nemaberci.comment.dto.Comment
import hu.nemaberci.comment.enum.CommentOwnerType
import hu.nemaberci.comment.input.CommentInput
import hu.nemaberci.comment.input.CommentOwnerInput
import hu.nemaberci.comment.proto.CommentOuterClass
import hu.nemaberci.comment.proto.CommentServiceGrpc
import hu.nemaberci.comment.service.CommentService
import net.devh.boot.grpc.client.inject.GrpcClient
import net.devh.boot.grpc.server.service.GrpcService
import hu.nemaberci.user.proto.User
import hu.nemaberci.user.proto.UserServiceGrpc
import io.grpc.stub.StreamObserver
import org.springframework.beans.factory.annotation.Autowired
import javax.annotation.PostConstruct

@GrpcService
class CommentGrpcService : CommentServiceGrpc.CommentServiceImplBase() {

    @GrpcClient("userService")
    private lateinit var userServiceBlockingStub: UserServiceGrpc.UserServiceBlockingStub

    @Autowired
    private lateinit var commentService: CommentService

    @PostConstruct
    fun initRole() {

        userServiceBlockingStub.registedRole(
                User.RegisterRole.newBuilder()
                        .setRole(CommentService.ROLE_COMMENT)
                        .build()
        )

    }

    fun dtoToGrpcClass(comment: Comment): CommentOuterClass.Comment {
        return CommentOuterClass.Comment.newBuilder()
                .setId(comment.id)
                .setText(comment.text)
                .setCreatedBy(comment.createdBy)
                .setOwner(
                        CommentOuterClass.Owner.newBuilder()
                                .setOwnerId(comment.owner.id)
                                .setOwnerType(
                                        CommentOuterClass.CommentOwner.valueOf(
                                                comment.owner.type.toString()
                                        )
                                )
                                .build()
                )
                .build()
    }

    override fun all(request: CommentOuterClass.NoParams, responseObserver: StreamObserver<CommentOuterClass.Comment>) {
        for (comment in commentService.getAll()) {
            responseObserver.onNext(dtoToGrpcClass(comment))
        }
        responseObserver.onCompleted()
    }

    override fun byOwner(request: CommentOuterClass.Owner, responseObserver: StreamObserver<CommentOuterClass.Comment>) {
        for (comment in commentService.getByOwner(
                CommentOwnerInput(
                        id = request.ownerId,
                        type = CommentOwnerType.valueOf(request.ownerType.toString())
                ))
        ) {
            responseObserver.onNext(dtoToGrpcClass(comment))
        }
        responseObserver.onCompleted()
    }

    override fun byUser(request: CommentOuterClass.Email, responseObserver: StreamObserver<CommentOuterClass.Comment>) {
        for (comment in commentService.getByUser(request.email)) {
            responseObserver.onNext(dtoToGrpcClass(comment))
        }
        responseObserver.onCompleted()
    }

    private fun actuallyCreate(request: CommentOuterClass.CommentInput): CommentOuterClass.NoParams {
        commentService.create(
                CommentInput(
                        text = request.text,
                        owner = CommentOwnerInput(
                                id = request.owner.ownerId,
                                type = CommentOwnerType.valueOf(request.owner.ownerType.toString())
                        )
                ),
                request.createdBy
        )
        return CommentOuterClass.NoParams.getDefaultInstance()
    }

    override fun create(request: CommentOuterClass.CommentInput, responseObserver: StreamObserver<CommentOuterClass.NoParams>) {
        responseObserver.onNext(actuallyCreate(request))
        responseObserver.onCompleted()
    }

}