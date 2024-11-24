import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Licence } from 'src/licence/entities/licence.entity';
import { Provider } from 'src/provider/entities/provider.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'licences_per_client' })
export class LicencePerClient {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Client, client => client.licencePerClients)
    client: Client;

    @ManyToOne(() => Licence, licence => licence.licencePerClients)
    licence: Licence;

    @ManyToOne(() => Provider, provider => provider.licencePerClients)
    provider: Provider;

    @ManyToOne(() => User, user => user.licencePerClients)
    user: User;

    @Column()
    purchase_date: string;

    @Column()
    quantity: number;
}
