import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OpenComponent } from './open.component';

describe('OpenComponent', () => {
  let component: OpenComponent;
  let fixture: ComponentFixture<OpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenComponent],
      providers: [HttpClient, HttpHandler]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should', waitForAsync(() => {
    spyOn(component, 'onClick');
    let button = fixture.debugElement.query(By.css('#openButton'));
    button.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      expect(component.onClick).toHaveBeenCalled();
    })
  }))
});
