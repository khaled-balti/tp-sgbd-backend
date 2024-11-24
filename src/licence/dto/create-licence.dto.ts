export class CreateLicenceDto{
    name: string
    sku: string
    price: number
    logo?: Express.Multer.File
}
