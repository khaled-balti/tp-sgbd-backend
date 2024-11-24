export class UpdateUserDto {
    first_name: string
    last_name: string
    email: string
    role: string
    image?: Express.Multer.File
}
