import { Injectable } from '@angular/core';
import { Event } from '../model/event';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CalendarEvent } from 'angular-calendar';
import { EventColors, mapToColor } from '../util/colorMapping';

import * as moment from 'moment';
import { mapToIcon } from '../util/iconMapping';

import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class DataserviceService {

  eventsColl: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore, private domSanitizer: DomSanitizer) { }

  getAllEvents(viewDate) {

    const start = moment(viewDate).startOf('month').unix() * 1000;
    const end = moment(viewDate).endOf('month').unix() * 1000;

    const all: CalendarEvent[] = [];

    this.eventsColl = this.afs.collection('events', ref => {
      return ref
              .where('date', '>=', start)
              .where('date', '<=', end);
    });

    const promise = new Promise((resolve, reject) => {
      this.eventsColl.snapshotChanges().subscribe((data) => {
        data.map((ev) => {
          all.push({
            id: ev.payload.doc.id,
            start: new Date(ev.payload.doc.data().date),
            title: ev.payload.doc.data().comment,
            color: mapToColor(ev.payload.doc.data().type),
            meta: {
              type: '' + ev.payload.doc.data().type,
              icon: this.domSanitizer.bypassSecurityTrustUrl(mapToIcon(ev.payload.doc.data().type))
            }
          });
        });
        resolve(all);
      }, err => {
        reject(err);
      });
    });
    return promise;
  }

  saveEvent(event): Promise<any> {

    if (event.id != null) {
      return this.eventsColl.doc(event.id).set({
        comment: event.comment,
        type: Number(event.type),
        date: event.timestamp.getTime()
      });
    } else {
      return this.eventsColl.add({
        comment: event.comment,
        type: Number(event.type),
        date: event.timestamp.getTime()
      });
    }

  }

  delete(eventId): Promise<any> {
    return this.eventsColl.doc(eventId).delete();
  }
}
