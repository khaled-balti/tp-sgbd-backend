export class CreateProviderDto {
  name: string;
  email: string;
  phone: string;
  logo?: Express.Multer.File;
  //   country: string;
  state: string;
  city: string;
}
