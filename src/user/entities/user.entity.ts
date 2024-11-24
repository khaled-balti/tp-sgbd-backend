import { Client } from "src/client/entities/client.entity";
import { Licence } from "src/licence/entities/licence.entity";
import { LicencePerClient } from "src/licence_per_client/entities/licence_per_client.entity";
import { Provider } from "src/provider/entities/provider.entity";
import { Report } from "src/report/entities/report.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({nullable: true})
    image?: string

    @Column()
    role: string

    @OneToMany(() => Licence, licence => licence.user)
    licences: Licence[];

    @OneToMany(() => Client, client => client.user)
    clients: Client[];

    @OneToMany(() => Provider, provider => provider.user)
    providers: Provider[];

    @OneToMany(() => Report, report => report.user)
    reports: Report[];

    @OneToMany(() => LicencePerClient, licencePerClient => licencePerClient.user)
    licencePerClients: LicencePerClient[];
}
