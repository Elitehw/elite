import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
    private event: EventService,
    private router: Router
  ) {
    this.event.isLogin.subscribe((res: boolean) => {
      if (res) {
        this.router.navigate(['/user/dashboard']);
      }
    });

  }

  ngOnInit(): void {
  }

}
