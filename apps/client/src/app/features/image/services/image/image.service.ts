import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../global/services/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getAllImages() {
    return this.http.get<string[]>(
      `${this.configService.getBackendBaseURL()}/images`
    );
  }

  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('file', image, image.name);
    return this.http.post<{ name: string }>(
      `${this.configService.getBackendBaseURL()}/images/upload`,
      formData
    );
  }

  deleteImage(name: string) {
    return this.http.delete(
      `${this.configService.getBackendBaseURL()}/images/${name}`
    );
  }
}
