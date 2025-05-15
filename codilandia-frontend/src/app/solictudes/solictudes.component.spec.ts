import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolictudesComponent } from './solictudes.component';

describe('SolictudesComponent', () => {
  let component: SolictudesComponent;
  let fixture: ComponentFixture<SolictudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolictudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolictudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
