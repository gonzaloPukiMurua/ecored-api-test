/* eslint-disable prettier/prettier */
import { ListingStatus } from "../entities/listing.entity";
export class ListingResponseDto {
  listing_id!: string;
  title!: string;
  description?: string;
  owner!: { user_id: string }; // solo id del usuario
  category!: { category_id: string; name: string }; // id + nombre
  subcategory?: { category_id: string; name: string }; // opcional
  photos?: { photo_id: string; url: string; position: number }[];
  status!: ListingStatus;
  created_at!: Date;
  updated_at!: Date;
  active!: boolean;
}