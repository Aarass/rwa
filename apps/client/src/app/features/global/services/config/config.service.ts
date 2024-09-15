import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private backendBaseURL = 'http://localhost:3000';
  // private backendBaseURL = 'http://178.149.108.197:3000';
  getBackendBaseURL() {
    return this.backendBaseURL;
  }

  getImageURL(imageName: string) {
    return `${this.backendBaseURL}/images/${imageName}`;
  }

  getPlaceholderImageURL() {
    return `https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg`;
  }
}
