import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportListRecipesComponent } from './import-list-recipes.component';

describe('ImportListRecipesComponent', () => {
  let component: ImportListRecipesComponent;
  let fixture: ComponentFixture<ImportListRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportListRecipesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportListRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
