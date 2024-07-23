import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLocationDto } from '@rwa/shared';
import { Repository } from 'typeorm';
import { Location } from '../../entities/location';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private http: HttpService
  ) {}
  async create(locationId: string): Promise<Location | null> {
    const response = await firstValueFrom(
      this.http.get<GeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${locationId}&key=${process.env.GOOGLE_KEY}`
      )
    );

    if (response.status != 200) {
      console.error('http status code is not 200');
      return null;
    }

    const json: GeocodeResponse = response.data;

    if (json.status != 'OK') {
      console.error('inner status is not OK');
      return null;
    }

    if (response.data.results.length != 1) {
      console.error(
        `Got unexpected number of locations as a response: ${response.data.results.length}`
      );
      return null;
    }

    const data = response.data.results[0];

    const location = this.locationRepository.create({
      id: locationId,
      name: data.formatted_address,
      lat: data.geometry.location.lat,
      lng: data.geometry.location.lng,
    });

    try {
      await this.locationRepository.insert(location);
    } catch (err) {
      console.error('Error during inserting newly fetched location: ', err);
      throw new InternalServerErrorException();
    }

    return location;
  }

  async suggest(input: string) {
    const response = await firstValueFrom(
      this.http.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${process.env.GOOGLE_KEY}`
      )
    );

    if (response.status != 200) {
      console.error('http status code is not 200');
      return null;
    }

    const data = response.data;

    if (data.status != 'OK') {
      console.error('inner status is not OK');
      return null;
    }

    return data;
  }

  async findAll() {
    return await this.locationRepository.find();
  }

  async findOne(id: string) {
    return await this.locationRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return await this.locationRepository.delete({ id });
  }
}

interface GeocodeResponse {
  results: {
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
  status: string;
}
