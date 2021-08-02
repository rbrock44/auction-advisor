import {Component, OnInit, ViewChild} from '@angular/core';
import {Person} from '../../model/person.model';
import {SettingsService} from '../../service/settings.service';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {EditPersonComponent} from '../../component/edit-person/edit-person.component';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
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
      this.displayColumns.push('edit');
    }
    this.settingsService.getPeopleChange().subscribe(people => {
      this.dataSource.data = people;
    });
  }

  openEditDialog(person: Person): void {
    event.preventDefault();

    const dialogRef = this.dialog.open(EditPersonComponent, {
      data: {
        person: person
      }
    });
  }
}
