import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import * as moment from "moment";
import { BehaviorSubject } from "rxjs";

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
   * Nome del formControl da utilizzare (in tutti i casi tranne che per RANGE_DATE)
   */
  @Input("formControlNameInput") formControlNameInput: string | null = null;

  /**
   * Nome del formControlName da utilizzare per RANGE_DATE
   */
  @Input("formControlNameInputStart") formControlNameInputStart: string | null = null;

  /**
   * Nome del formControlName da utilizzare per RANGE_DATE
   */
  @Input("formControlNameInputEnd") formControlNameInputEnd: string | null = null;

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
   * ngModel da bindare nel campo di input della data/data e orario/orario
   */
  @Input("initialValue") initialValue: Date | string | null = null;

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

  private _data = new BehaviorSubject<any[]>([]);

  // change data to use getter and setter
  @Input()
  set data(value) {
    // set the latest value for _data BehaviorSubject
    this._data.next(value);
  }

  get data() {
    // get the latest value from _data BehaviorSubject
    return this._data.getValue();
  }

  //#endregion

  //#region OUTPUT

  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() ngModelInputChange: EventEmitter<Date | string | number> = new EventEmitter<Date | string | number>();

  //#endregion

  //#region INSERTED INPUT TRACKET

  /* input trackers */
  range: { from: Date | null; to: Date | null } = { from: null, to: null };
  dateTimeInput: Date | null = null;

  tmpTimeInput: string | null | undefined = undefined;

  //#endregion
  constructor(private cd: ChangeDetectorRef) {}

  val: any = null;
  onChange: any = (event: any) => {
    this.cd.detectChanges();
  };
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
    } else if (this.type == PickerModeEnum.DATE_RANGE && val) {
      if (val?._d) {
        val.utc(true);
      } else {
        val.from = this.convertDate(val.from);
        val.to = this.convertDate(val.to);
      }
    }

    this.val = val;
    this.onChange(val);
    this.onTouch(val);

    if (this.ngModelInputChange != null && this.type != PickerModeEnum.DATE_RANGE) {
      this.ngModelInput = this.val;
      this.ngModelInputChange.emit(this.val);
    }
  }

  ngOnInit(): void {
    this.onInputDateChange(this.ngModelInput);
    this.setPlaceholder();
    this.disableComponent();
    this.cd.detectChanges();
  }

  /***
   * function to track input changes for DATE_RANGE picker mode:
   **/
  onInputDateChange(event: any) {
    if (!this.formGroupInput) {
      if (this.type == PickerModeEnum.DATE_RANGE) {
        if (event.from && event.to) {
          this.range = event;
          this.writeValue(this.range);
        } else {
          this.writeValue(event.value);
        }
      } else if ([PickerModeEnum.DATETIME, PickerModeEnum.DATE].includes(this.type)) {
        if (event.value) {
          this.writeValue(event.value);
        } else {
          this.dateTimeInput = event;
          this.writeValue(this.dateTimeInput);
        }
      }
    } else if ([PickerModeEnum.DATE_RANGE, PickerModeEnum.DATE].includes(this.type) && event?.value) {
      event.value.utc(true);
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
    if (!this.disabled && this.formGroupInput && this.formControlNameInput) {
      if (this.formControlNameInput)
        this.disabled =
          this.formGroupInput.disabled || this.formGroupInput.controls[this.formControlNameInput].disabled;
    } else if (this.disabled && this.formGroupInput && this.formControlNameInput)
      if (this.formControlNameInput) this.disabled = this.formGroupInput.disabled;
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
