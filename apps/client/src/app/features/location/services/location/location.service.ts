import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationSuggestionDto } from '@rwa/shared';
import { ConfigService } from '../../../global/services/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getSuggestions(input: string) {
    return this.http.get<{
      predictions: LocationSuggestionDto[];
    }>(`${this.configService.getBackendBaseURL()}/locations/suggestion`, {
      params: {
        input,
      },
    });
  }
}
