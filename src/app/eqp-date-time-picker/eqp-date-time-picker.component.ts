import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import * as moment from "moment";

@Component({
  selector: "app-eqp-date-time-picker",
  templateUrl: "./eqp-date-time-picker.component.html",
  styleUrls: ["./eqp-date-time-picker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EqpDateTimePickerComponent),
      multi: true
    }
  ]
})
export class EqpDateTimePickerComponent implements OnInit, ControlValueAccessor {
  //#region INPUT

  /**
   * Modalità di visualizzazione del picker.
   */
  @Input("type") type: PickerModeEnum = PickerModeEnum.DATE;

  /**
   * Imposta l'input come readonly e l'unico modo per selezionare una data è tramite il picker
   */
  @Input("readonlyInput") readonlyInput: boolean = true;

  /**
   * Imposta la data minima e massima
   */
  @Input("minDate") minDate: Date | null = null;
  @Input("maxDate") maxDate: Date | null = null;

  /**
   * Imposta l'input come required
   */
  @Input("isRequired") isRequired: boolean = false;

  /**
   * Da specificare in caso di utilizzo di formControlName, il nome del formGroup utilizzato nel tag <form>
   */
  @Input("formGroupInput") formGroupInput: FormGroup | null = null;

  /**
   * Nome del formControlName da utilizzare, nel caso del date-range sarà necessario usare
   * gli ultimi due input e non il primo
   */
  @Input("formControlNameInput") formControlNameInput: string | null = null;
  @Input("formControlNameStartInput") formControlNameStartInput: string | null = null;
  @Input("formControlNameEndInput") formControlNameEndInput: string | null = null;

  /**
   * Placeholder visualizzato nel campo di input della data/data e orario/orario.
   */
  @Input("placeholder") placeholder: string = "";

  /**
   * Placeholder visualizzati nel campo di input del range di date.
   */
  @Input("startPlaceholeder") startPlaceholeder: string = "";
  @Input("endPlaceholeder") endPlaceholeder: string = "";

  /**
   * ngModel da bindare nel campo di input della data/data e orario/orario
   */
  @Input("ngModelInput") ngModelInput: Date | string | null = null;

  /**
   * ngModel da bindare nel campo di input del range di date
   */
  @Input("ngModelInputStart") ngModelInputStart: Date | null = null;
  @Input("ngModelInputEnd") ngModelInputEnd: Date | null = null;

  /**
   * Input dei componenti ngx-mat-datetime-picker e ngx-mat-timepicker.
   * Per dettagli seguire la guida al link: "https://www.npmjs.com/package/@angular-material-components/datetime-picker"
   */
  @Input("disabled") disabled: boolean = false;
  @Input("showSpinners") showSpinners: boolean = true;
  @Input("showSeconds") showSeconds: boolean = false;
  @Input("disableMinute") disableMinute: boolean = false;
  //@Input("defaultTime") defaultTime: Array<any> | undefined = undefined;
  @Input("stepHour") stepHour: number = 1;
  @Input("stepMinute") stepMinute: number = 1;
  @Input("stepSecond") stepSecond: number = 1;
  @Input("color") color: ThemePalette = undefined;
  @Input("enableMeridian") enableMeridian: boolean = false;
  @Input("touchUi") touchUi: boolean = false;
  hideTime: boolean = false;

  //#endregion

  //#region OUTPUT

  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();

  //#endregion

  //#region INSERTED INPUT TRACKET

  /* Date and DateTime trackers */
  selectedDate?: Date | null;
  fromDate?: Date | null;
  toDate?: Date | null;
  selectedDateTime?: Date | null;

  /* time trackers */
  timePickerInput: string = "";
  tmpTimeInput: string = "";
  timePicker: any;

  //#endregion

  constructor() {}

  val: any = null;
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  set value(val: any) {
    if ([PickerModeEnum.DATE, PickerModeEnum.DATETIME].includes(this.type)) {
      val = this.convertDate(val);
    }

    this.val = val;
    this.onChange(val);
    this.onTouch(val);
  }

  ngOnInit(): void {
    this.setPlaceholder();
    this.disableComponent();
  }

  /***
   * function to track input changes for specific picker mode:
   * DATE_RANGE
   * the function update the current value and then emits it
   **/
  onInputDateChange(event: any, type: PickerModeEnum, isFrom: boolean = false, isTo: boolean = false) {
    if (event.value != null) {
      if (type == PickerModeEnum.DATE_RANGE) {
        if (
          this.formGroupInput == null &&
          (this.formControlNameStartInput == null || this.formControlNameEndInput == null)
        ) {
          if (isFrom) {
            this.fromDate = event.value;
          } else {
            this.toDate = event.value;
            this.dateChange.emit({ fromDate: this.convertDate(this.fromDate), toDate: this.convertDate(this.toDate) });
          }
        } else if (
          this.formGroupInput != null &&
          this.formControlNameStartInput != null &&
          this.formControlNameEndInput != null
        ) {
        }
      }
    }
  }

  /***
   * this function update the time string hh:MM or hh:MM:ss
   **/
  changeTime(event: Date, showSeconds: boolean) {
    event = new Date(event);
    this.tmpTimeInput = showSeconds
      ? event.getHours() + ":" + event.getMinutes() + ":" + event.getSeconds()
      : event.getHours() + ":" + event.getMinutes();

    this.writeValue(this.tmpTimeInput);
  }

  /***
   * function called on init to set the placeholders based on picker type.
   * if the picker type is DATE_RANGE and isRequired is true, the endPlaceholeder
   * ll'have * at the end of it
   **/
  setPlaceholder() {
    if (this.type != PickerModeEnum.DATE_RANGE && this.placeholder == "") {
      if (this.type == PickerModeEnum.DATE) this.placeholder = "Seleziona una data";
      else if (this.type == PickerModeEnum.DATETIME) this.placeholder = "Seleziona una data e un orario";
      else if (this.type == PickerModeEnum.TIME) this.placeholder = "Seleziona un orario";
    } else if (this.type == PickerModeEnum.DATE_RANGE) {
      if (this.startPlaceholeder == "") this.startPlaceholeder = "Seleziona date inizio";
      if (this.endPlaceholeder == "") this.endPlaceholeder = "fine";
      if (this.isRequired) this.endPlaceholeder = this.endPlaceholeder.concat(" *");
    }
  }

  /***
   * manage the daisable of the component when it's used inside a orm group
   **/
  disableComponent() {
    if (
      !this.disabled &&
      this.formGroupInput &&
      (this.formControlNameInput || (this.formControlNameStartInput && this.formControlNameEndInput))
    ) {
      if (this.formControlNameInput)
        this.disabled =
          this.formGroupInput.disabled || this.formGroupInput.controls[this.formControlNameInput].disabled;
      else if (this.formControlNameStartInput && this.formControlNameEndInput) {
        this.disabled =
          this.formGroupInput.disabled || this.formGroupInput.controls[this.formControlNameStartInput].disabled;
        this.disabled =
          this.formGroupInput.disabled || this.formGroupInput.controls[this.formControlNameEndInput].disabled;
      }
    } else if (
      this.disabled &&
      this.formGroupInput &&
      (this.formControlNameInput || (this.formControlNameStartInput && this.formControlNameEndInput))
    )
      if (this.formControlNameInput) this.disabled = this.formGroupInput.disabled;
      else if (this.formControlNameStartInput && this.formControlNameEndInput) {
        this.disabled = this.formGroupInput.disabled;
        this.disabled = this.formGroupInput.disabled;
      }
  }

  //#region HELPER FUNCTIONS
  stopProp(e: Event) {
    e.stopPropagation();
  }

  convertDate(date: Date | null | undefined) {
    return moment(date).utc(true);
  }
  //#endregion
}

export enum PickerModeEnum {
  DATETIME = 1,
  DATE = 2,
  TIME = 3,
  DATE_RANGE = 4
}
