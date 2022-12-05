import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-eqp-date-time-picker",
  templateUrl: "./eqp-date-time-picker.component.html",
  styleUrls: ["./eqp-date-time-picker.component.scss"]
})
export class EqpDateTimePickerComponent implements OnInit {
  //#region INPUT

  /* GENERAL INPUTS */
  @Input("type") type: PickerModeEnum = PickerModeEnum.DATE;
  @Input("disabled") disabled: boolean = false;

  /* DATE - DATETIME INPUT */
  @Input("ngModelInput") ngModelInput?: Date | null;
  @Input("dateTimePlaceholder") dateTimePlaceholder: string = "Choose date";

  /* DATEPICKER-RANGE INPUTS */
  @Input("ngModelInputStart") ngModelInputStart?: Date | null;
  @Input("ngModelInputEnd") ngModelInputEnd?: Date | null;
  @Input("startPlaceholeder") startPlaceholeder: string = "Start date";
  @Input("endPlaceholeder") endPlaceholeder: string = "End date";

  /* TIME PICKER INPUTS */
  @Input("showSeconds") showSeconds: boolean = false;
  @Input("ngModelInputTime") ngModelInputTime: string = "";
  @Input("timePlaceholder") timePlaceholder: string = "Choose time";

  //#endregion

  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();

  selectedDate?: Date | null;

  fromDate?: Date | null;
  toDate?: Date | null;

  selectedDateTime?: Date | null;

  timePickerInput: string = "";
  tmpTimeInput: string = "";
  timePicker: any;

  constructor() {}

  ngOnInit(): void {}

  onInputDateChange(event: any, type: PickerModeEnum, isFrom: boolean = false, isTo: boolean = false) {
    if (event.value != null) {
      if (type == PickerModeEnum.DATE) {
        this.selectedDate = event.value;
        this.dateChange.emit(this.selectedDate);
      } else if (type == PickerModeEnum.DATE_RANGE) {
        if (isFrom) {
          this.fromDate = event.value;
        } else {
          this.toDate = event.value;
          this.dateChange.emit({ fromDate: this.fromDate, toDate: this.toDate });
        }
      } else if (type == PickerModeEnum.DATETIME) {
        this.selectedDateTime = event.value;
        this.dateChange.emit(this.selectedDateTime);
      }
    }
  }

  changeTime(event: Date, showSeconds: boolean) {
    event = new Date(event);
    this.tmpTimeInput = showSeconds
      ? event.getHours() + ":" + event.getMinutes() + ":" + event.getSeconds()
      : event.getHours() + ":" + event.getMinutes();
  }

  setTime() {
    this.timePickerInput = this.tmpTimeInput;
    this.dateChange.emit(this.timePickerInput);
  }

  stopProp(e: Event) {
    e.stopPropagation();
  }
}

export enum PickerModeEnum {
  DATETIME = 1,
  DATE = 2,
  TIME = 3,
  DATE_RANGE = 4
}
