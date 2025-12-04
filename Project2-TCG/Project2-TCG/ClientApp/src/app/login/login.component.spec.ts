import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LoginHeaderComponent } from '../login-header/login-header.component';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [HttpClient, HttpHandler, LoginHeaderComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should', waitForAsync(() => {
    spyOn(component, 'onClick');
    let button = fixture.debugElement.query(By.css('#loginButton'));
    button.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      expect(component.onClick).toHaveBeenCalled();
    })
  }))
});
