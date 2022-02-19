import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportListHeaderComponent } from './import-list-header.component';

describe('ImportListHeaderComponent', () => {
  let component: ImportListHeaderComponent;
  let fixture: ComponentFixture<ImportListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportListHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
