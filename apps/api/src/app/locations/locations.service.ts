import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '@rwa/entities';
import { LocationSuggestionDto } from '@rwa/shared';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private http: HttpService
  ) {}
  async searchOnGoogleAndSave(locationId: string): Promise<Location | null> {
    const url = `https://api.locationiq.com/v1/lookup?key=${process.env.API_KEY}&osm_ids=${locationId}&normalizeaddress=1`;
    const response = await firstValueFrom(this.http.get(url));

    if (response.status != 200) {
      console.error('http status code is not 200');
      return null;
    }

    const data: Dto[] = response.data;

    if (data.length != 1) {
      console.error(
        `Got unexpected number of locations as a response: ${data.length}`
      );
      return null;
    }

    const place = data[0];

    const location = this.locationRepository.create({
      id: locationId,
      name: getDisplayName(place),
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    });

    try {
      await this.locationRepository.insert(location);
    } catch (err) {
      console.error('Error during inserting newly fetched location: ', err);
      throw new InternalServerErrorException();
    }

    return location;
  }

  async suggest(input: string): Promise<LocationSuggestionDto[]> {
    const url = `https://api.locationiq.com/v1/autocomplete?key=${process.env.API_KEY}&q=${input}&limit=5`;
    const response = await firstValueFrom(this.http.get(url));

    const data: Dto[] = response.data;

    return data.map((el) => ({
      id: el.osm_type.charAt(0).toUpperCase() + el.osm_id,
      display_name: getDisplayName(el),
    }));
  }

  async checkLocation(id: string) {
    let location = await this.findOne(id);

    if (location == null) {
      // console.info('Prvi put vidim ovu lokaciju, potrazicu na google-u...');
      location = await this.searchOnGoogleAndSave(id);

      if (location == null) {
        throw new BadRequestException(`Invalid location id`);
      }
    } else {
      // console.info('Lokacija vec postoji u bazi');
    }
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

interface Dto {
  place_id: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  display_name: string;
  display_place: string;
  address: Partial<{
    name: string;
    house_number: string;
    road: string;
    suburb: string;
    city: string;
    country: string;
  }>;
}

function getDisplayName(place: Dto) {
  const name = place.address.name ? `${place.address.name} ` : '';
  const road = place.address.road ? `${place.address.road} ` : '';
  const house_number = place.address.house_number
    ? `${place.address.house_number} `
    : '';
  const suburb = place.address.suburb ? `${place.address.suburb} ` : '';
  const city = place.address.city ? `${place.address.city} ` : '';
  const country = place.address.country ?? '';

  return name + road + house_number + suburb + city + country;
}
