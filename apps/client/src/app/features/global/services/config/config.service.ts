import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private backendBaseURL = 'http://localhost:3000';
  getBackendBaseURL() {
    return this.backendBaseURL;
  }

  getImageURL(imageName: string) {
    return `${this.backendBaseURL}/images/${imageName}`;
  }
}
