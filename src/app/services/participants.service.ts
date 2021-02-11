import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ParticipantsInterface } from '../participants-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {

  private url: string = 'http://localhost:4400/participants';
  constructor(private http: HttpClient) { }

  getParticipants(): Observable<ParticipantsInterface> {
    return this.http.get<ParticipantsInterface>(this.url).pipe(retry(1), catchError(this.handleError));
  };

  getParticipant(searchParam): Observable<ParticipantsInterface> {
    return this.http.get<ParticipantsInterface>(`${this.url}/${searchParam}`).pipe(retry(1), catchError(this.handleError));
  };

  newTeamEntry(newTeamData): Observable<ParticipantsInterface> {
    return this.http.post<ParticipantsInterface>(`${this.url}`, newTeamData).pipe(retry(1), catchError(this.handleError));
  };

  updateTeamValues(teamId, updatedTeamData): Observable<ParticipantsInterface> {
    return this.http.put<ParticipantsInterface>(`${this.url}/${teamId}`, updatedTeamData).pipe(retry(1), catchError(this.handleError));
  };

  deleteTeamValue(teamId): Observable<ParticipantsInterface> {
    return this.http.delete<ParticipantsInterface>(`${this.url}/${teamId}`).pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }


}
