import {Component, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {Person} from '../../model/person.model';
import {SettingsService} from '../../service/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {EditPersonComponent, EditPersonDialogData} from '../../component/edit-person/edit-person.component';
import {EDIT_COLUMN} from '../../constants/constants';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
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

    this.dialog.open<EditPersonComponent, EditPersonDialogData>(EditPersonComponent, {
      data: {
        person
      }
    });
  }
}
