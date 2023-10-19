import { Prisma, PrismaClient } from "@prisma/client";
import HashService from "@services/hash.service";
import ErrorService from "@appTypes/Error";
import AuthService from "./auth.service";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import EmailService from "./email.service";
import { CLASSFLOW_HOST_FRONTEND, DOMAIN, ORIGINS } from "@env";
import { URLSearchParams } from "url";

export default class UserService {
    prisma = new PrismaClient();
    hashService = new HashService();
    authService = new AuthService();
    emailService = new EmailService();
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
        await this.sendVerificationEmail(result.email, result.id)
        return result;
    }

    public async sendVerificationEmail(email: string, id: number) {
        let token = await this.authService.getTokenVerifyEmail(id);
        this.emailService.sendEmail(email, "Válida tu cuenta", `
            <p>Accede al siguiente enlace para validar tu cuenta</p>
            <a href="${CLASSFLOW_HOST_FRONTEND}/validate?token=${token}">Validar cuenta</a>
        `)

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

    public async verifyEmail(token: string) {

        try {
            let { id } = await this.authService.validateVerifyEmailToken(token);
            const result = await this.prisma.user.update({
                where: {
                    id
                },
                data: {
                    emailVerified: true
                }
            })

        } catch (error: any) {
            if (error instanceof TokenExpiredError) {
                throw new ErrorService(
                    "El token ha caducado",
                    "",
                    401
                )
            }
            if (error instanceof JsonWebTokenError) {
                throw new ErrorService(
                    "El token es inválido",
                    "",
                    400
                )
            }
            throw new ErrorService(
                "Ha sucedido un error validando tu cuenta",
                "",
                500
            )
        }
        return "ok"
    }
}