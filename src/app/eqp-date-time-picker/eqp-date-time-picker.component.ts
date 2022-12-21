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
   * @property PickerModeEnum.DATETIME [vaue = 1] - tipologia date time picker
   * @property PickerModeEnum.DATE [value = 2] - tipologia date picker
   * @property PickerModeEnum.TIME [value = 3] - tipologia time picker
   * @property PickerModeEnum.DATE_RANGE [value = 4] - tipologia date range picker
   */
  @Input("type") type: PickerModeEnum = PickerModeEnum.DATE;

  /**
   * Imposta l'input come readonly.
   * @property {boolean} [default = true]
   */
  @Input("readonlyInput") readonlyInput: boolean = true;

  /**
   * Imposta la data minima inseribile
   * @property {Date | null} [default = null]
   */
  @Input("minDate") minDate: Date | null = null;

  /**
   * Imposta la data massima inseribile
   * @property {Date | null} [default = null]
   */
  @Input("maxDate") maxDate: Date | null = null;

  /**
   * Imposta l'input come obbligatorio
   * @property {boolean} [default = true]
   */
  @Input("isRequired") isRequired: boolean = false;

  /**
   * Da specificare in caso di utilizzo di formControlName, il nome del formGroup utilizzato nel tag <form>.
   * Da utilizzare solo se non viene usato il binding tramite ngModelInput.
   * @property {FormGroup | null} [default = null]
   */
  @Input("formGroupInput") formGroupInput: FormGroup | null = null;

  /**
   * Nome del formControl da utilizzare (in tutti i casi tranne che per RANGE_DATE).
   * Da utilizzare solo se non viene usato il binding tramite ngModelInput
   * @property {string | null} [default = null]
   */
  @Input("formControlNameInput") formControlNameInput: string | null = null;

  /**
   * Nome del formControlName da utilizzare per RANGE_DATE (data inizio).
   * Da utilizzare solo se non viene usato il binding tramite ngModelInput
   * @property {string | null} [default = null]
   */
  @Input("formControlNameInputStart") formControlNameInputStart: string | null = null;

  /**
   * Nome del formControlName da utilizzare per RANGE_DATE (data fine).
   * Da utilizzare solo se non viene usato il binding tramite ngModelInput
   * @property {string | null} [default = null]
   */
  @Input("formControlNameInputEnd") formControlNameInputEnd: string | null = null;

  /**
   * ngModel da bindare per tutte le tipologie di picker.
   * Da utilizzare solo se non viene usato il binding tramite FormGroup e FormControl
   */
  @Input("ngModelInput") ngModelInput: Date | string | null = null;

  /**
   * Placeholder visualizzato in caso di DATE, DATETIME, TIME.
   * @property {string} [default_DATE = "Seleziona una data"]
   * @property {string} [default_DATETIME = "Seleziona una data e un orario"]
   * @property {string} [default_TIME = "Seleziona un orario"]
   */
  @Input("placeholder") placeholder: string = "";

  /**
   * Placeholder visualizzato in caso di DARE_RANGE (data inizio).
   * @property {string} [default_DARE_RANGE_start = "Seleziona date inizio"]
   */
  @Input("startPlaceholeder") startPlaceholeder: string = "";

  /**
   * Placeholder visualizzato in caso di DARE_RANGE (data fine).
   * @property {string} [default_DARE_RANGE_end = "fine"]
   */
  @Input("endPlaceholeder") endPlaceholeder: string = "";

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

  range: { from: Date | null; to: Date | null } = { from: null, to: null };
  dateTimeInput: Date | null = null;
  tmpTimeInput: string | null | undefined = undefined;
  changeTimeValue: boolean = true;

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

    if (this.changeTimeValue) {
      this.val = val;
      this.onChange(val);
      this.onTouch(val);
    }

    if (this.ngModelInputChange != null && this.type != PickerModeEnum.DATE_RANGE) {
      this.ngModelInput = this.val;
      this.ngModelInputChange.emit(this.val);
    }
  }

  ngOnInit(): void {
    if (!this.formGroupInput) {
      this.onInputDateChange(this.ngModelInput);
    } else {
      if (this.formControlNameInput) {
        if (this.type != PickerModeEnum.TIME) {
          this.formGroupInput
            .get(this.formControlNameInput)
            ?.setValue(this.convertDate(this.formGroupInput.get(this.formControlNameInput)?.value));
        } else {
          this.value = this.formGroupInput.get(this.formControlNameInput)?.value;
        }
      } else if (this.formControlNameInputStart && this.formControlNameInputEnd) {
        try {
          this.formGroupInput
            .get(this.formControlNameInputStart)
            ?.setValue(this.convertDate(this.formGroupInput.get(this.formControlNameInputStart)?.value));

          this.formGroupInput
            .get(this.formControlNameInputEnd)
            ?.setValue(this.convertDate(this.formGroupInput.get(this.formControlNameInputEnd)?.value));
        } catch (error) {
          console.log("select the end date");
        }
      }
    }

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
      } else if ([PickerModeEnum.DATETIME, PickerModeEnum.DATE, PickerModeEnum.TIME].includes(this.type)) {
        if (event.value) {
          this.writeValue(event.value);
        } else {
          this.dateTimeInput = event;
          this.writeValue(this.dateTimeInput);
        }
      }
    } else if ([PickerModeEnum.DATE_RANGE, PickerModeEnum.DATE, PickerModeEnum.DATETIME].includes(this.type)) {
      if (this.formControlNameInput) this.formGroupInput.get(this.formControlNameInput)?.value.utc(true);
      if (this.formControlNameInputStart && this.formControlNameInputEnd) {
        try {
          this.formGroupInput.get(this.formControlNameInputStart)?.value?.utc(true);
          this.formGroupInput.get(this.formControlNameInputEnd)?.value?.utc(true);
        } catch (error) {
          console.log("select the end date");
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

    //this.writeValue(this.tmpTimeInput);
  }

  setValue() {
    this.changeTimeValue = true;
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
   * manage the daisable of the component when it's used inside a form group
   **/
  disableComponent() {
    if (this.disabled && this.formGroupInput) {
      if (this.formControlNameInput) {
        this.formGroupInput.get(this.formControlNameInput)?.disable();
      }
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
