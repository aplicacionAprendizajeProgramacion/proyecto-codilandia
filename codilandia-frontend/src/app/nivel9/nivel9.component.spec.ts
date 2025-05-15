import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nivel9Component } from './nivel9.component';

describe('Nivel9Component', () => {
  let component: Nivel9Component;
  let fixture: ComponentFixture<Nivel9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nivel9Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nivel9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
