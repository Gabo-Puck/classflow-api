import { Prisma, PrismaClient } from "@prisma/client";

export default class UsuarioService {
    prisma = new PrismaClient();
    public async createUsuario(usuario: Prisma.UserCreateInput): Promise<Prisma.UserUncheckedCreateInput> {
        const result = await this.prisma.user.create({
            data: usuario
        });
        return result;
    }
    public async deleteUsuario(id: number): Promise<Prisma.UserUncheckedCreateInput> {
        const result = await this.prisma.user.delete({
            where: {
                id: id
            }
        });
        return result;
    }
    public async updateUsuario(id: number, usuario: Prisma.UserCreateInput): Promise<Prisma.UserUncheckedCreateInput> {
        const result = await this.prisma.user.update({
            where: { id: Number(id) },
            data: {
                ...usuario
            }
        });
        return result;
    }
    public async getUsuarioById(id: number): Promise<Prisma.UserUncheckedCreateInput> {
        const result = await this.prisma.user.findUniqueOrThrow({
            where: {
                id: id
            }
        });
        return result;
    }
    public async getAllUsuarios(): Promise<Prisma.UserUncheckedCreateInput[]> {
        const result = await this.prisma.user.findMany();
        return result;
    }
}