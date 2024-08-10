import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appDurationPicker]'
})
export class DurationPickerDirective {

    private navigationKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', ':'];

    constructor(private el: ElementRef<HTMLInputElement>) {
        this.el.nativeElement.value = '00:00:00'; // Set initial value
        this.el.nativeElement.style.textAlign = 'right'; // Align text to right
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.navigationKeys.indexOf(event.key) === -1 && (event.key !== ' ' && isNaN(Number(event.key)))) {
            event.preventDefault();
        }
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent): void {
        const input = this.el.nativeElement;
        const cursorPosition = input.selectionStart || 0;

        // Determine which section (HH, MM, SS) the cursor is in
        let sectionStart = 0;
        let sectionEnd = 0;

        switch (true) {
            case (cursorPosition >= 0 && cursorPosition <= 2): // HH section
                sectionStart = 0;
                sectionEnd = 2;
                break;
            case (cursorPosition >= 3 && cursorPosition <= 5): // MM section
                sectionStart = 3;
                sectionEnd = 5;
                break;
            case (cursorPosition >= 6 && cursorPosition <= 8): // SS section
                sectionStart = 6;
                sectionEnd = 8;
                break;
            default:
                break;
        }

        // Highlight the section based on cursor position
        input.setSelectionRange(sectionStart, sectionEnd);
    }

    @HostListener('input', ['$event.target'])
    onInput(target: HTMLInputElement): void {
        let value = target.value.replace(/\D/g, ''); // Remove non-numeric characters
        value = this.pad(value, 6); // Ensure length of value is 6 characters (HHMMSS)

        // Format value into HH:MM:SS
        target.value = `${value.substring(0, 2)}:${value.substring(2, 4)}:${value.substring(4, 6)}`;

        // Maintain the highlighted section after input
        const cursorPosition = target.selectionStart || 0;

        // Determine which section (HH, MM, SS) the cursor is in after input
        let sectionStart = 0;
        let sectionEnd = 0;

        switch (true) {
            case (cursorPosition >= 0 && cursorPosition <= 2): // HH section
                sectionStart = 0;
                sectionEnd = 2;
                break;
            case (cursorPosition >= 3 && cursorPosition <= 5): // MM section
                sectionStart = 3;
                sectionEnd = 5;
                break;
            case (cursorPosition >= 6 && cursorPosition <= 8): // SS section
                sectionStart = 6;
                sectionEnd = 8;
                break;
            default:
                break;
        }

        // Highlight the section based on cursor position after input
        target.setSelectionRange(sectionStart, sectionEnd);

        // Move the cursor to the next section if two digits are input
        if (cursorPosition === 2) { // If inputting in HH section
            target.setSelectionRange(3, 5); // Move cursor to MM section
        } else if (cursorPosition === 5) { // If inputting in MM section
            target.setSelectionRange(6, 8); // Move cursor to SS section
        }
    }

    private pad(num: string, size: number): string {
        let paddedNum = num.trim();
        while (paddedNum.length < size) {
            paddedNum = '0' + paddedNum;
        }
        return paddedNum;
    }
}

