import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageDto } from '@rwa/shared';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  getAllImages() {
    return this.http.get<string[]>('http://localhost:3000/images');
  }

  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('file', image, image.name);
    return this.http.post<{ name: string }>(
      `http://localhost:3000/images/upload`,
      formData
    );
  }

  deleteImage(name: string) {
    return this.http.delete(`http://localhost:3000/images/${name}`);
  }
}
