import { Component, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ImageService } from '../../../image/services/image/image.service';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';

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
  images: ImageData[] | null = null;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  constructor(private store: Store, private imageService: ImageService) {}

  ngOnInit(): void {
    this.imageService.getAllImages().subscribe((names) => {
      this.images = names.map((name) => ({
        name,
        src: `http://localhost:3000/images/${name}`,
      }));
    });
  }

  delete(item: any) {
    if (this.images == null) {
      console.error('Imposible');
      return;
    }

    this.imageService.deleteImage(item.name).subscribe();
    this.images = this.images.filter((image) => image.name != item.name);
  }
}
