import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nivel10Component } from './nivel10.component';

describe('Nivel10Component', () => {
  let component: Nivel10Component;
  let fixture: ComponentFixture<Nivel10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nivel10Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nivel10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
