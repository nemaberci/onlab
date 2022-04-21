package hu.nemaberci.user.grpc

import hu.nemaberci.user.proto.User
import hu.nemaberci.user.proto.UserServiceGrpc
import hu.nemaberci.user.service.RoleService
import hu.nemaberci.user.service.UserService
import io.grpc.stub.StreamObserver
import net.devh.boot.grpc.server.service.GrpcService
import org.springframework.beans.factory.annotation.Autowired

@GrpcService
class UserGrpcService: UserServiceGrpc.UserServiceImplBase() {

    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var roleService: RoleService

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

    private fun actuallyResigterRole(role: String): User.NoParams {
        try {
            roleService.createRole(role)
        } catch (e: Exception) {
            println("Could not create role:")
            e.printStackTrace()
        }
        return User.NoParams.getDefaultInstance()
    }

    override fun registedRole(request: User.RegisterRole, responseObserver: StreamObserver<User.NoParams>) {
        responseObserver.onNext(actuallyResigterRole(request.role))
        responseObserver.onCompleted()
    }

}