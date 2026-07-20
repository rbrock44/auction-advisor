import {Component, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {Person} from '../../model/person.model';
import {SettingsService} from '../../service/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {EditPersonComponent} from '../../component/edit-person/edit-person.component';
import {EDIT_COLUMN} from '../../constants/constants';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PeopleComponent implements OnInit {
  dataSource = new MatTableDataSource<Person>();
  displayColumns: string[] = ['id', 'firstName', 'lastName', 'email'];

  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.settingsService.people;
    if (this.settingsService.canEdit) {
      this.displayColumns.push(EDIT_COLUMN);
    }
    this.settingsService.peopleSubject.subscribe(people => {
      this.dataSource.data = people;
    });
  }

  openEditDialog(person: Person): void {
    if (!!event) {
      event.preventDefault();
    }

    this.dialog.open(EditPersonComponent, {
      data: {
        person
      }
    });
  }
}
