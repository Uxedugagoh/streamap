import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { hash } from 'argon2';

@Injectable()
export class AccountService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async me(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        return user
    }

    public async create(input: CreateUserInput) {
        const {username, email, password} = input
        // Проверка юзернейма и почты
        const isUsernameExists = await this.prismaService.user.findUnique({
            where: {
                username
            }
        })

        if(isUsernameExists) {
            throw new ConflictException('username already exists')
        }

        const isEmailExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if(isEmailExists) {
            throw new ConflictException('email already exists')
        }
        // Создание пользователя в БД
        await this.prismaService.user.create({
            data: {
                username,
                email,
                password: await hash(password), // hash из библиотеки Argon2
                displayName: username
            }
        })
        return true
    }
}
