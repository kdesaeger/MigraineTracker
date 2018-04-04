import { Component, OnInit } from '@angular/core';
import { DataserviceService } from './service/dataservice.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CalendarEvent } from 'angular-calendar';
import { AuthService } from './service/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  event: FormGroup;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  view = 'month';
  email: string;
  password: string;
  loginFailed = false;

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:no-trailing-whitespace
  constructor(private dataService: DataserviceService, private fb: FormBuilder,
    public authService: AuthService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.event = this.fb.group({
      comment: '',
      type: ['1', Validators.required],
      timestamp: [new Date(), Validators.required],
      id: null
    });

    this.loadEvents();

  }

  loadEvents() {
    if (this.authService.user) {
      this.dataService.getAllEvents(this.viewDate).then((data) => {
        this.events = data as CalendarEvent[];
      }, err => {
        this.showToast('Error loading events');
      });
    }
  }

  onSubmit() {
    this.dataService.saveEvent(this.event.value).then(() => {
      this.event.reset({
        comment: '',
        type: '1',
        timestamp: new Date()
      });

      this.dataService.getAllEvents(this.viewDate).then((data) => {
        this.events = data as CalendarEvent[];
      });
    }, err => {
      this.showToast('Error saving event');
    });
  }

  onDelete() {
    if (this.event.value.id) {
      this.dataService.delete(this.event.value.id).then(() => {
        this.dataService.getAllEvents(this.viewDate).then((data) => {
          this.events = data as CalendarEvent[];
          this.event.reset({
            comment: '',
            type: '1',
            timestamp: new Date()
          });
        });
      }, err => {
        this.showToast('Error deleting event');
      });
    }
  }

  onDayClicked(event) {
    this.event.reset({
      comment: '',
      type: '1',
      timestamp: event.day.date
    });
    window.scrollTo(0, 0);
  }

  onEventClicked(ev, event) {
    ev.stopPropagation();

    this.event.reset({
      id: event.id,
      comment: event.title,
      type: event.meta.type,
      timestamp: event.start
    });

    window.scrollTo(0, 0);
  }

  signup() {
    this.authService.signup(this.email, this.password);
    this.email = this.password = '';
  }

  login() {
    this.loginFailed = false;
    this.authService.login(this.email, this.password).then(() => {
      this.email = this.password = '';
      this.loadEvents();
    }, err => {
      this.loginFailed = true;
    });
  }

  logout() {
    this.authService.logout();
  }

  onDateChanged() {
    this.dataService.getAllEvents(this.viewDate).then((data) => {
      this.events = data as CalendarEvent[];
    });
  }

  isVisible() {
    return false;
  }

  showToast(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

}
