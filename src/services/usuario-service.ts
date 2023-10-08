import { Prisma, PrismaClient } from "@prisma/client";
import HashService from "@services/hash-service";
import ErrorService from "@appTypes/Error";

export default class UserService {
    prisma = new PrismaClient();
    hashService = new HashService();
    public async createUser(user: Prisma.UserCreateInput): Promise<Prisma.UserUncheckedCreateInput> {
        //search for user with the required email
        let foundUser = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        });
        //found validation
        if (foundUser !== null) {
            throw new ErrorService(
                "El correo ingresado ya se encuentra registrado",
                user,
                400
            );
        }
        //hash the password before creating user
        user.password = await this.hashService.hashData(user.password);
        const result = await this.prisma.user.create({
            data: user
        });
        return result;
    }
    public async deleteUser(id: number): Promise<Prisma.UserUncheckedCreateInput> {
        const result = await this.prisma.user.delete({
            where: {
                id: id
            }
        });
        return result;
    }
    public async updateUser(id: number, user: Prisma.UserCreateInput): Promise<Prisma.UserUncheckedCreateInput> {
        const result = await this.prisma.user.update({
            where: { id: Number(id) },
            data: {
                ...user
            }
        });
        return result;
    }
    public async getUserById(id: number): Promise<Prisma.UserUncheckedCreateInput> {
        try {
            const result = await this.prisma.user.findUniqueOrThrow({
                where: {
                    id: id
                }
            });
            return result;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ErrorService(
                    "No se encontro el usuario",
                    { id },
                    404
                )
            }
            throw error;
        }
    }
    public async getUserByEmail(email: string) {
        const result = await this.prisma.user.findFirst({
            where: {
                email
            }
        });
        return result;
    }
    public async getAllUsers(): Promise<Prisma.UserUncheckedCreateInput[]> {
        const result = await this.prisma.user.findMany();
        return result;
    }
}