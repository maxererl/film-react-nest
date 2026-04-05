import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InferSchemaType, Model, Schema, Types } from 'mongoose';
import { FilmDTO, ScheduleDTO } from 'src/films/dto/films.dto';

const ScheduleSchema = new Schema({
  id: { type: String, required: true },
  daytime: { type: String, required: true },
  hall: { type: Number, required: true },
  rows: { type: Number, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  taken: { type: [String], default: [] },
});

export const FilmSchema = new Schema({
  id: { type: String, required: true },
  rating: { type: Number, required: true },
  director: { type: String, required: true },
  tags: { type: [String], required: true },
  title: { type: String, required: true },
  about: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  cover: { type: String, required: true },
  schedule: { type: [ScheduleSchema], required: true },
});

export type FilmDocument = InferSchemaType<typeof FilmSchema> & {
  _id: Types.ObjectId;
};

export type ScheduleDocument = InferSchemaType<typeof ScheduleSchema>;

@Injectable()
export class MongoFilmsRepository {
  constructor(@InjectModel('Film') private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<FilmDTO[]> {
    const items = await this.filmModel.find({}).lean();
    return items.map(this.filmMapperFn);
  }

  async findById(id: string): Promise<FilmDTO> {
    const film = await this.filmModel.findOne({ id }).lean();
    return film ? this.filmMapperFn(film) : null;
  }

  async findByIdAndUpdate(
    updateFn: (film: FilmDocument) => void,
    ...ids: string[]
  ): Promise<FilmDocument[]> {
    const films = await this.filmModel.find({ id: { $in: ids } });
    films.forEach(updateFn);
    await this.filmModel.bulkSave(films);
    return films;
  }

  private scheduleMapperFn = (root: ScheduleDocument): ScheduleDTO => ({
    id: root.id,
    daytime: root.daytime,
    hall: root.hall,
    rows: root.rows,
    seats: root.seats,
    price: root.price,
    taken: root.taken,
  });

  private filmMapperFn = (root: FilmDocument): FilmDTO => ({
    id: root.id,
    rating: root.rating,
    director: root.director,
    tags: root.tags,
    title: root.title,
    about: root.about,
    description: root.description,
    image: root.image,
    cover: root.cover,
    schedule: root.schedule.map(this.scheduleMapperFn),
  });
}
