import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExternalRace } from '../models/external-race';
import { WishlistItem } from '../models/wishlist-item';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-race-details-dialog',
  templateUrl: './race-details-dialog.component.html',
  styleUrls: ['./race-details-dialog.component.css']
})
export class RaceDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RaceDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExternalRace | WishlistItem,
    private sanitizer: DomSanitizer
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getSanitizedDescription(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml((this.data as any).sanitized_description || this.data.description);
  }

  getRaceUrl(): string {
    return (this.data as any).external_race_url || this.data.url;
  }
}
