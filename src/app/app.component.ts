import { Component, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-chart-project';
  bodyBackgroundColor: string = '';

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.setBodyBackgroundColor();
  }

  onLightModeChanged(lightMode: boolean) {
    this.bodyBackgroundColor = lightMode ? '#ffffff' : '#000000';
    this.setBodyBackgroundColor();
  }

  setBodyBackgroundColor() {
    this.renderer.setStyle(
      document.body,
      'background-color',
      this.bodyBackgroundColor
    );
  }
}
