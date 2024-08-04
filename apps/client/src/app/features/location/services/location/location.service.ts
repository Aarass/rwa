import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationSuggestionDto } from '@rwa/shared';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getSuggestions(input: string) {
    return this.http.get<{
      predictions: LocationSuggestionDto[];
    }>('http://localhost:3000/locations/suggestion', {
      params: {
        input,
      },
    });
  }
}
