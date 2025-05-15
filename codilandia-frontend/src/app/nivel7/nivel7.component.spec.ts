import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nivel7Component } from './nivel7.component';

describe('Nivel7Component', () => {
  let component: Nivel7Component;
  let fixture: ComponentFixture<Nivel7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nivel7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nivel7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
