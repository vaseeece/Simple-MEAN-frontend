import { Component, OnInit, Input } from '@angular/core';
import { ParticipantsService } from '../services/participants.service';
import { ParticipantsInterface } from '../participants-interface';


@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {
  newTeamName: string;
  participants: ParticipantsInterface;
  errmsg;
  newTeam: ParticipantsInterface;
  dataFound: boolean;
  searchParam: string;
  key: string = 'team_name';
  sortReverse: boolean = false;
  currentIndex: number = 1;
  resultsPerPage: number = 10;
  pairingCount: number = 0;
  enablePairing: boolean = false;
  pairingTeamsDetails = [];
  pairingTeamOne: string;
  pairingTeamTwo: string;
  pointsForWinning: number = 3;
  pointsForLoosing: number = 0;
  pointsForTie: number = 1;
  teamOneResult: string;
  teamTwoResult: string;
  PairingDeclarations = [
    'Win',
    'Loose',
    'Tie'
  ];
  deleteingTeam = {};

  constructor(private participantsService: ParticipantsService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.participantsService.getParticipants().subscribe(response => {
      this.participants = response;
      // json = [...new Map(response.map(item => [item["team_name"], item])).values()] --- to remove duplicate elemnts in array
      console.log(this.participants);
      this.dataFound = true;
    }, error => {
      this.errmsg = error;
      console.log(this.errmsg);
    });
  }

  getAllUsersScoreSorted() {
    this.pairingCount = 0;
    this.enablePairing = false;
    this.pairingTeamsDetails = [];
    this.participantsService.getParticipants().subscribe(response => {
      this.participants = response;
      this.dataFound = true;
      this.sort('score');
    }, error => {
      this.errmsg = error;
      console.log(this.errmsg);
    });
  }

  addNewTeam(newTeamName?: string) {
    if (newTeamName) {
      this.newTeam = {
        "team_name": newTeamName,
        "wins": 0,
        "losses": 0,
        "ties": 0,
        "score": 0
      }
    }
    if (this.newTeam) {
      this.participantsService.newTeamEntry(this.newTeam).subscribe(response => {
        this.participants = response;
        this.getAllUsers();
      }, error => {
        this.errmsg = error;
        console.log(this.errmsg);
      });
    }
  }

  onSearch(searchParam) {
    this.participantsService.getParticipant(searchParam).subscribe(response => {
      this.participants = response;
    }, error => {
      this.errmsg = error;
      console.log(this.errmsg);
    });
  }

  sort(key) {
    this.key = key;
    this.sortReverse = !this.sortReverse;
  }

  dropDownHandler(dropDownValue) {
    this.resultsPerPage = Number(dropDownValue.target.value);
  }

  pairingCheckbox(event, teamDetails, index) {
    if (event.target.checked) {
      this.pairingCount = this.pairingCount + 1;
      this.pairingTeamsDetails.push(teamDetails);
      if (this.pairingCount === 2) {
        this.enablePairing = true;
        this.pairingTeamOne = this.pairingTeamsDetails[0].team_name;
        this.pairingTeamTwo = this.pairingTeamsDetails[1].team_name;
      }
      else {
        this.enablePairing = false;
      }
    }
    if (!event.target.checked) {
      this.pairingCount = this.pairingCount - 1;
      this.pairingTeamsDetails.splice(index, 1);
      if (this.pairingCount === 2) {
        this.enablePairing = true;
        this.pairingTeamOne = this.pairingTeamsDetails[0].team_name;
        this.pairingTeamTwo = this.pairingTeamsDetails[1].team_name;
      }
      else {
        this.enablePairing = false;
      }
    }

  }

  deleteTeamDetails(team) {
    console.log(team);
    this.deleteingTeam = team;
    console.log('deleteTeamArray', this.deleteingTeam);
  }

  deleteTeam(teamId) {
    this.participantsService.deleteTeamValue(teamId).subscribe(response => {
      this.participants = response;
    }, error => {
      this.errmsg = error;
      console.log(this.errmsg);
    });
    console.log('delete team id',teamId);
  }

  radioChangeHandler(radioValue) {

    if(radioValue.target.value && radioValue.target.value === 'teamOneWin'
    || radioValue.target.value === 'teamOneLoose' || radioValue.target.value === 'teamOneTie') {
      this.teamOneResult = radioValue.target.value;
    }
    if(radioValue.target.value && radioValue.target.value === 'teamTwoWin'
    || radioValue.target.value === 'teamTwoLoose' || radioValue.target.value === 'teamTwoTie') {
      this.teamTwoResult = radioValue.target.value;
    }
  }

  submitPairingResults() {

    if(this.teamOneResult === 'teamOneWin'){
      this.pairingTeamsDetails[0].wins = this.pairingTeamsDetails[0].wins + 1;
      this.pairingTeamsDetails[0].score = this.pairingTeamsDetails[0].score + this.pointsForWinning;
    }
    if(this.teamOneResult === 'teamOneLoose'){
      this.pairingTeamsDetails[0].losses = this.pairingTeamsDetails[0].losses + 1;
      this.pairingTeamsDetails[0].score = this.pairingTeamsDetails[0].score + this.pointsForLoosing;
    }
    if(this.teamOneResult === 'teamOneTie'){
      this.pairingTeamsDetails[0].ties = this.pairingTeamsDetails[0].ties + 1;
      this.pairingTeamsDetails[0].score = this.pairingTeamsDetails[0].score + this.pointsForTie;
    }

    if(this.teamTwoResult === 'teamTwoWin'){
      this.pairingTeamsDetails[1].wins = this.pairingTeamsDetails[1].wins + 1;
      this.pairingTeamsDetails[1].score = this.pairingTeamsDetails[1].score + this.pointsForWinning;
    }
    if(this.teamTwoResult === 'teamTwoLoose'){
      this.pairingTeamsDetails[1].losses = this.pairingTeamsDetails[1].losses + 1;
      this.pairingTeamsDetails[1].score = this.pairingTeamsDetails[1].score + this.pointsForLoosing;
    }
    if(this.teamTwoResult === 'teamTwoTie'){
      this.pairingTeamsDetails[1].ties = this.pairingTeamsDetails[1].ties + 1;
      this.pairingTeamsDetails[1].score = this.pairingTeamsDetails[1].score + this.pointsForTie;
    }
    console.log('Results of pairing', this.pairingTeamsDetails);

    this.participantsService.updateTeamValues(this.pairingTeamsDetails[0]._id, this.pairingTeamsDetails[0]).subscribe(response => {
      console.log('updatedResponse', response);
    }, error => {
      this.errmsg = error;
      console.log(this.errmsg);
    });

    this.participantsService.updateTeamValues(this.pairingTeamsDetails[1]._id, this.pairingTeamsDetails[1]).subscribe(response => {
      console.log('updatedResponse', response);
    }, error => {
      this.errmsg = error;
      console.log(this.errmsg);
    });

    this.getAllUsersScoreSorted();
  }

}
