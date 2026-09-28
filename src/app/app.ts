import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxGraphModule } from '@swimlane/ngx-graph'

@Component({
  imports: [RouterOutlet, NgxGraphModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('graph-board');

  nodes = [
    { id: 'start', label: 'Start' },
    { id: 'end', label: 'End' },

  ]

  edge = [
    { id: 'link1', source: 'start', target: "end", lable: "First Link" }
  ]

  onNodeClick(event: any) {
    console.log("Node clicked");

  }

}
