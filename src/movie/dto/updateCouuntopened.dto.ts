import { IsString } from 'class-validator';

export class UpdateCountopenedDto {
    @IsString()
    slug: string
}