/* eslint-disable prettier/prettier */
import { ListingStatus } from "../enums/listing-status.enum";

export class ListingResponseDto {
  listing_id!: string;
  title!: string;
  description?: string;
  owner!: { user_id: string };
  category!: { category_id: string; name: string };
  subcategory?: { category_id: string; name: string };
  photos?: { photo_id: string; url: string; position: number }[];
  status!: ListingStatus;
  created_at!: Date;
  updated_at!: Date;
  active!: boolean;
}