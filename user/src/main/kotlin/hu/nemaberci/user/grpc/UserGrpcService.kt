package hu.nemaberci.user.grpc

import hu.nemaberci.user.proto.User
import hu.nemaberci.user.proto.UserServiceGrpc
import hu.nemaberci.user.service.UserService
import io.grpc.stub.StreamObserver
import net.devh.boot.grpc.server.service.GrpcService
import org.springframework.beans.factory.annotation.Autowired

@GrpcService
class UserGrpcService: UserServiceGrpc.UserServiceImplBase() {

    @Autowired
    private lateinit var userService: UserService

    private fun actuallyAddRole(emailAddress: String?, id: Long?, role: String): User.NoParams {
        userService.addRole(emailAddress, id, role)
        return User.NoParams.getDefaultInstance()
    }

    override fun addRole(request: User.ModifyRole, responseObserver: StreamObserver<User.NoParams>) {
        responseObserver.onNext(actuallyAddRole(request.emailAddress, request.id, request.role))
        responseObserver.onCompleted()
    }

    private fun actuallyDeleteRole(emailAddress: String?, id: Long?, role: String): User.NoParams {
        userService.deleteRole(emailAddress, id, role)
        return User.NoParams.getDefaultInstance()
    }

    override fun deleteRole(request: User.ModifyRole, responseObserver: StreamObserver<User.NoParams>) {
        responseObserver.onNext(actuallyDeleteRole(request.emailAddress, request.id, request.role))
        responseObserver.onCompleted()
    }

}