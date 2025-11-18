/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ecopoint_actions')
export class EcopointAction {
  @PrimaryGeneratedColumn('uuid')
  action_id!: string;

  @Column({ unique: true })
  name!: string; // Ej: "Publicar"

  @Column({ type: 'int' })
  points_base!: number; // Ej: 5

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}
