import {   Field, Entity, IdEntity } from "@remult/core";

@Entity<TagEntity>( {
    key: 'tag'
})
export class TagEntity extends IdEntity {
    @Field()
    tag: string;
}
