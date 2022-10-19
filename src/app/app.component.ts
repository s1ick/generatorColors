import { Component, QueryList, ViewChildren, ElementRef, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import * as chroma from 'chroma-js'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChildren('colElement') colElement!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    document.addEventListener('keydown', (event) => {
      event.preventDefault()
      if (event.code.toLowerCase() === 'space') {
        this.setRandomColors(null)
      }
    })

    document.addEventListener('click', (event: any) => {
      const type = event.target.dataset.type

      if (type === 'lock') {
        console.log('check');
        const node =
          event.target.tagName.toLowerCase() === 'i'
            ? event.target
            : event.target.children[0]

        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
      } else if (type === 'copy') {
        this.copyToClickboard(event.target.textContent)
      }
    })
    this.setRandomColors(true);
  }


  public setRandomColors(isInitial: any) {
    const colors = isInitial ? this.getColorsFromHash() : []
    this.colElement?.forEach((col, index) => {

      const isLocked = col.nativeElement.querySelector('i').classList.contains('fa-lock')
      const text = col.nativeElement.querySelector('h2');
      const button = col.nativeElement.querySelector('button');


      if (isLocked) {
        colors.push(text.textContent)
        return
      }

      const color = isInitial
        ? colors[index]
          ? colors[index]
          : chroma.random().hex()
        : chroma.random().hex()


      if (!isInitial) {
        colors.push(color)
      }

      text.textContent = color
      col.nativeElement.style.background = color;

      this.setTextColor(text, color);
      this.setTextColor(button, color);
    })
    this.updateColorsHash(colors)
  }
  public setTextColor(text: any, color: any) {
    const luminance = chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white'
  }
  public copyToClickboard(text: any) {
    return navigator.clipboard.writeText(text)
  }
  public getColorsFromHash() {
    if (document.location.hash.length > 1) {
      return document.location.hash
        .substring(1)
        .split('-')
        .map((color) => '#' + color)
    }
    return []
  }
  public updateColorsHash(colors: any) {
    document.location.hash = colors
      .map((col: any) => {
        return col.toString().substring(1)
      })
      .join('-')
  }
}