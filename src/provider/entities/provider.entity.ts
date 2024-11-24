import { Address } from "src/address/entities/address.entity";
import { LicencePerClient } from "src/licence_per_client/entities/licence_per_client.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "providers"})
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({nullable: true})
    logo?: string;

    @OneToOne(() => Address)
    @JoinColumn()
    address: Address;

    @OneToMany(() => LicencePerClient, licencePerClient => licencePerClient.provider)
    licencePerClients: LicencePerClient[];

    @ManyToOne(() => User, user => user.providers)
    user: User;
}
