import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './component/header/header.component';
import { ViewBarComponent } from './component/view-bar/view-bar.component';
import { AddBarComponent } from './component/add-bar/add-bar.component';
import { AlertComponent } from './component/alert/alert.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HeaderComponent, ViewBarComponent, AddBarComponent, AlertComponent, RouterOutlet]
})
export class AppComponent {
  title = 'auction-advisor';
}
