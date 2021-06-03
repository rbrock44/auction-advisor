import {Component, OnInit, ViewChild} from '@angular/core';
import {Person} from '../../model/person.model';
import {SettingsService} from '../../service/settings.service';
import {MatSort, MatTableDataSource} from '@angular/material';

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

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.settingsService.people;
    this.settingsService.getPeopleChange().subscribe(people => {
      this.dataSource.data = people;
    });
  }

}
