import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../schema/user.schema';

type TypeData = keyof User

export const UserDecor = createParamDecorator((data: TypeData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    return data ? user[data] : user // Если мы передали определенные поля для пользователя, то получим их, или все поля
})