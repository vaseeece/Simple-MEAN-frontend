import { Component, OnInit } from '@angular/core';
import { ParticipantsService } from './services/participants.service';
import { ParticipantsInterface } from './participants-interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hacker-premier-league-app';
  participants: ParticipantsInterface;
  searchParam;
  errmsg;
  searchFlag: boolean;
  constructor(private participantsService: ParticipantsService) { }

  ngOnInit(): void {
  }

  onSearch(searchParam) {
    this.participantsService.getParticipant(searchParam).subscribe(response => {
      this.participants = response;
      this.searchFlag = true;
      console.log(this.participants);
    }, error => {
      this.errmsg = error;
      console.log(this.errmsg);
    });
  }

}


