import { Component, QueryList, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import * as chroma from 'chroma-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChildren('colElement') colElements!: QueryList<ElementRef>;
  private readonly COLORS_COUNT = 5;

  ngAfterViewInit(): void {
    this.setupEventListeners();
    this.setRandomColors(true);
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', (event) => {
      if (event.code.toLowerCase() === 'space') {
        event.preventDefault();
        this.setRandomColors(false);
      }
    });

    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const type = target.dataset['type'];

      if (!type) return;

      if (type === 'lock') {
        this.toggleLock(target);
      } else if (type === 'copy') {
        this.copyToClipboard(target.textContent || '');
      }
    });
  }

  private toggleLock(element: HTMLElement): void {
    const node = element.tagName.toLowerCase() === 'i' 
      ? element 
      : element.querySelector('i') as HTMLElement;

    if (!node) return;

    node.classList.toggle('fa-lock-open');
    node.classList.toggle('fa-lock');
  }

  public setRandomColors(isInitial: boolean): void {
    const colors = isInitial ? this.getColorsFromHash() : [];
    
    this.colElements?.forEach((col, index) => {
      const element = col.nativeElement;
      const text = element.querySelector('h2') as HTMLElement;
      const button = element.querySelector('button') as HTMLElement;
      const isLocked = element.querySelector('i')?.classList.contains('fa-lock');

      if (isLocked && text.textContent) {
        colors.push(text.textContent);
        return;
      }

      const color = this.generateColor(isInitial, colors, index);
      
      if (!isInitial) {
        colors.push(color);
      }

      text.textContent = color;
      element.style.background = color;

      this.setTextColor(text, color);
      this.setTextColor(button, color);
    });

    this.updateColorsHash(colors);
  }

  private generateColor(isInitial: boolean, colors: string[], index: number): string {
    return isInitial && colors[index] 
      ? colors[index] 
      : chroma.random().hex();
  }

  private setTextColor(element: HTMLElement, color: string): void {
    if (!element) return;
    const luminance = chroma(color).luminance();
    element.style.color = luminance > 0.5 ? 'black' : 'white';
  }

  private copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
  }

  private getColorsFromHash(): string[] {
    if (document.location.hash.length > 1) {
      return document.location.hash
        .substring(1)
        .split('-')
        .map(color => `#${color}`);
    }
    return [];
  }

  private updateColorsHash(colors: string[]): void {
    document.location.hash = colors
      .map(col => col.substring(1))
      .join('-');
  }
}