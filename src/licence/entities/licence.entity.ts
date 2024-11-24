import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { LicencePerClient } from 'src/licence_per_client/entities/licence_per_client.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'licences' })
export class Licence {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    sku: string;

    @Column('float')
    price: number;

    @Column({nullable: true})
    logo: string;

    @OneToMany(() => LicencePerClient, licencePerClient => licencePerClient.licence)
    licencePerClients: LicencePerClient[];

    @ManyToOne(() => User, user => user.licences)
    user: User;
}
