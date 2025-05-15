import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nivel8Component } from './nivel8.component';

describe('Nivel8Component', () => {
  let component: Nivel8Component;
  let fixture: ComponentFixture<Nivel8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nivel8Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nivel8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
