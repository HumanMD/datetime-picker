import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import * as moment from "moment";

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

  ngOnInit(): void {}

  /***
   * function to track input changes for specific picker mode:
   * - DATE
   * - DATE_RANGE
   * - DATETIME
   * for all modes, the function update the current value and then emits it
   ***/
  onInputDateChange(event: any, type: PickerModeEnum, isFrom: boolean = false, isTo: boolean = false) {
    if (event.value != null) {
      if (type == PickerModeEnum.DATE) {
        this.selectedDate = event.value;
        this.dateChange.emit(this.convertDate(this.selectedDate));
      } else if (type == PickerModeEnum.DATE_RANGE) {
        if (isFrom) {
          this.fromDate = event.value;
        } else {
          this.toDate = event.value;
          this.dateChange.emit({ fromDate: this.convertDate(this.fromDate), toDate: this.convertDate(this.toDate) });
        }
      } else if (type == PickerModeEnum.DATETIME) {
        this.selectedDateTime = event.value;
        this.dateChange.emit(this.convertDate(this.selectedDateTime));
      }
    }
  }

  /***
   * this function update the time string hh:MM or hh:MM:ss
   ***/
  changeTime(event: Date, showSeconds: boolean) {
    event = new Date(event);
    this.tmpTimeInput = showSeconds
      ? event.getHours() + ":" + event.getMinutes() + ":" + event.getSeconds()
      : event.getHours() + ":" + event.getMinutes();
  }

  /***
   * On submit time value, the function emit the final output
   ***/
  setTime() {
    this.timePickerInput = this.tmpTimeInput;
    this.dateChange.emit(this.timePickerInput);
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
