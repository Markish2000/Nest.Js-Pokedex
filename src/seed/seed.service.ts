import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

import { PokemonResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed(): Promise<string> {
    await this.pokemonModel.deleteMany({});

    const url: string = 'https://pokeapi.co/api/v2/pokemon?limit=650';
    const data: PokemonResponse = await this.http.get<PokemonResponse>(url);

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments: string[] = url.split('/');
      const no: number = Number(segments[segments.length - 2]);

      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Semilla ejecutada.';
  }
}
