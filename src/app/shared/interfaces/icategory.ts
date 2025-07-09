import { UUID } from "crypto";

export interface ICategory {
    id: UUID
    name: string;
    description: string;
    image_url: string;
}
