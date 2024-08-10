import { Component, OnInit } from '@angular/core';
import { RaceService } from '../race.service';
import { WishlistItem } from '../models/wishlist-item';
import { MatDialog } from '@angular/material/dialog';
import { RaceDetailsDialogComponent } from '../race-details-dialog/race-details-dialog.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DomElementSchemaRegistry } from '@angular/compiler';


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: WishlistItem[] = [];

  constructor(
    private raceService: RaceService, 
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.raceService.getWishlist().subscribe(
      (value: {wishlist: WishlistItem[]}) => {
        this.wishlist = value.wishlist.map(item => {
          if (typeof item.logo_url === 'string') {
            item.logo_url = this.sanitizeUrl(item.logo_url);
          }
          return item;
        });
        console.log('wishlist:', this.wishlist);
      },
      (error) => {
        console.error('Error fetching wishlist:', error);
      }
    );
  }


  sanitizeUrl(url: any): string {
    if (typeof url === 'string') {
      try {
        const parsedUrl = JSON.parse(url.replace(/'/g, '"'));
        if (parsedUrl && parsedUrl.hasOwnProperty('changingThisBreaksApplicationSecurity')) {
          console.log('sanitizing:', parsedUrl.changingThisBreaksApplicationSecurity);
          return parsedUrl.changingThisBreaksApplicationSecurity;
        }
      } catch (e) {
        console.log('Failed to parse URL:', url);
      }
    } else if (typeof url === 'object' && url.hasOwnProperty('changingThisBreaksApplicationSecurity')) {
      console.log('sanitizing:', url.changingThisBreaksApplicationSecurity);
      return url.changingThisBreaksApplicationSecurity;
    }
    console.log('url not sanitized:', url);
    return url;
  }
  
  
  
  

  viewDetails(item: WishlistItem): void {
    this.dialog.open(RaceDetailsDialogComponent, {
      width: '600px',
      data: item
    });
  
  }

  removeFromWishlist(raceId: number): void {
    this.raceService.removeFromWishlist(raceId).subscribe(
      (response) => {
        console.log('Race removed from wishlist:', response);
        this.loadWishlist(); // Reload wishlist after removal
      },
      (error) => {
        console.error('Error removing race from wishlist:', error);
      }
    );
  }

 
}
