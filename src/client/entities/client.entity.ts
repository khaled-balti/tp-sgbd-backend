import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { LicencePerClient } from 'src/licence_per_client/entities/licence_per_client.entity';
import { Address } from 'src/address/entities/address.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'clients' })
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @OneToOne(() => Address)
    @JoinColumn()
    address: Address;

    @OneToMany(() => LicencePerClient, licencePerClient => licencePerClient.client)
    licencePerClients: LicencePerClient[];

    @ManyToOne(() => User, user => user.clients)
    user: User;
}
