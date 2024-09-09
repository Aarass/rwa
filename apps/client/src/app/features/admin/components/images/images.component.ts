import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { ConfigService } from '../../../global/services/config/config.service';
import { ImageService } from '../../../image/services/image/image.service';

type ImageData = {
  name: string;
  src: string;
};

@Component({
  selector: 'app-images',
  standalone: true,
  imports: [CommonModule, GalleriaModule, ButtonModule],
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss',
})
export class ImagesComponent implements OnInit {
  images: ImageData[] = [];

  constructor(
    private configService: ConfigService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.imageService.getAllImages().subscribe((names) => {
      this.images = names.map((name) => ({
        name,
        src: `${this.configService.getBackendBaseURL()}/images/${name}`,
      }));
    });
  }

  delete(item: ImageData) {
    this.imageService.deleteImage(item.name).subscribe();
    this.images = this.images.filter((image) => image.name != item.name);
  }

  getNewIndex(index: number) {
    return Math.max(index - 1, 0);
  }
}
