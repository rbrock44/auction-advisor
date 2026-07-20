import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SettingsService } from '../../service/settings.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MainComponent {
  constructor(
    public service: SettingsService
  ) { }
}
