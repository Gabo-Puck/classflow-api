import { prisma } from "@libs/prisma"
import { randomUUID } from "crypto";
import { writeFile, unlink } from "fs/promises";
// import { fileTypeFromBuffer } from "file-type"
import dayjs from "dayjs";
import ErrorService from "@appTypes/Error";
import { File } from "@prisma/client";

export default class FileService {
    public async write(classId: number) {
        const result = await prisma.classEnrollment.findMany({
            where: {
                classId
            }
        });
        return result;
    }

    public async deleteFile(path: string) {
        try {
            // Use fs.unlink to delete the file
            await unlink(path);
        } catch (error) {
            throw new ErrorService("Algo ha salido mal al eliminar la imagen", "", 500)
        }
    }
    public async generateFilename(ext: string) {
        try {
            // Generate a unique UID
            const uniqueId = randomUUID();

            // Format the current date and time
            const currentDatetime = dayjs().format('YYYY-MM-DD_HH-mm-ss');

            // Combine UID and datetime to create a filename
            const filename = `file_${uniqueId}_${currentDatetime}.${ext}`;

            return filename;
        } catch (error) {
            console.error('Error generating filename:', error);
            throw error;
        }
    }
    public async saveBase64ToFileAsync(base64String: string, folder: string) {
        try {
            // Convert base64 to buffer
            const { fileTypeFromBuffer } = await (eval('import("file-type")') as Promise<typeof import('file-type')>);
            const fileBuffer = Buffer.from(base64String, 'base64');

            // Detect file type

            const type = await fileTypeFromBuffer(fileBuffer);

            if (!type) {
                throw new Error('Unable to determine file type.');
            }
            console.log({ type });
            let storagePath = ""
            let filename = await this.generateFilename(type.ext);
            storagePath = `${folder}/${filename}`
            // Validate file size (max: 10MB)
            const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
            if (fileBuffer.length > maxSizeInBytes) {
                throw new Error('El tamaño máximo de los archivos es 10mb');
            }

            // Validate file extension
            const allowedExtensions = ['zip', 'png', 'pdf', "jpg"];
            const fileExtension = type.ext;

            if (!allowedExtensions.includes(fileExtension)) {
                throw new Error('El tipo del archivo no es admitido. Tipos admitidos: .zip, .png, and .pdf');
            }

            // Write to file asynchronously
            await writeFile(storagePath, fileBuffer);
            return storagePath;
        } catch (error) {
            console.log(error);
            throw new ErrorService("Algo ha salido mal al guardar la imagen", "", 500)
        }
    }

    public async save(filename: string, base64String: string, folder: string): Promise<File> {
        try {
            let path = await this.saveBase64ToFileAsync(base64String, folder);
            let file = await prisma.file.create({
                data: {
                    filename,
                    path,
                }
            })
            return file
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async get(id: number) {
        try {
            const result = await prisma.file.findFirstOrThrow({
                where: {
                    id
                },
            });
            return result;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ErrorService(
                    "No se encontro el archivo",
                    { id },
                    404
                )
            }
            throw error;
        }
    }

    public async delete(id: number) {
        try {
            let { path } = await this.get(id);
            await this.deleteFile(path);
            let file = await prisma.file.delete({
                where: {
                    id
                }
            });
        } catch (error) {
            throw error
        }

    }

}

