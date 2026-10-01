import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { validate, ValidationError } from '@angular/forms/signals';
import { delay, map, of } from 'rxjs';
import { IfElse } from '../app/if-else';
import { Highlight } from '../app/highlight';
import { ConverterPipe } from '../app/converter-pipe';


@Component({
  imports: [ReactiveFormsModule, CommonModule, IfElse, Highlight, ConverterPipe],
  selector: 'app-employee-form',
  styleUrl: './employee-form.css',
  templateUrl: './employee-form.html',
})
export class EmployeeForm {
  fb = inject(FormBuilder);

  showP = false;

  appForm = this.fb.group({
    personal: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email], this.checkEmail],
      phone: ['', [Validators.pattern(/^\d{10}$/)]]
    }),
    skills: this.fb.array([], [Validators.min(1), Validators.max(5), this.uniqueSkill]),

    education: this.fb.group({
      institute: [''],
      startDate: [''],
      endDate: ['']
    }, {
      validator: [this.dateValidator]
    })

  })


  checkEmail(control: AbstractControl) {
    const res = of(["lathesh@gmail.com"].includes(control.value)).pipe(
      delay(300),
      map((avail) => avail ? { isExist: true } : null)
    )


    return res;
  }

  get email() {
    return this.appForm.get('personal.email') as FormControl;
  }
  get phone() {
    return this.appForm.get('personal.phone') as FormControl;
  }

  get skills() {
    return this.appForm.get('skills') as FormArray;
  }

  addSkill() {
    this.showP = !this.showP;
    this.skills.push(this.getSkill())
  }

  getSkill() {
    return this.fb.group({
      name: ['', Validators.required],
      exp: ['', [Validators.required]],

    })
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  uniqueSkill(arrayControl: AbstractControl) {
    const names = (arrayControl.value as { name: string }[])
      .map(skill => skill.name.toLowerCase())
      .filter(Boolean)

    return new Set(names).size === names.length ? null : { duplicate: true }
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const { startDate, endDate } = control.value;
    if (!startDate || !endDate) return null
    return endDate > startDate ? null : { endBeforeStart: true };
  }


}

