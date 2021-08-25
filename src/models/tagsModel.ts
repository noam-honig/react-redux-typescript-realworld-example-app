import {   Field, Entity, IdEntity } from "remult";

@Entity<TagEntity>( {
    key: 'tag'
})
export class TagEntity extends IdEntity {
    @Field()
    tag: string;
}
