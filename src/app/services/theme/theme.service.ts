import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;
  private subject = new BehaviorSubject<boolean>(this.darkMode);
  isDarkMode = this.subject.asObservable();

  constructor(private cookies: CookieService) {
    if (cookies.check('darkMode')) {
      this.darkMode = cookies.get('darkMode') === 'true';
    }
    this.subject.next(this.darkMode);
  }

  toggleMode() {
    this.darkMode = !this.darkMode;
    this.cookies.set('darkMode', this.darkMode.toString(), 30, '/');
    this.subject.next(this.darkMode);
  }
}
