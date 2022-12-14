import { Time } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  timePickerInput: string = "";
  dateTimePickerWithTime: any;
  fromDate: any;
  toDate: any;
  date: any;

  disable = false;

  formGroup = new FormGroup({
    timePickerInputControl: new FormControl(""),
    dateTimePickerWithTimeControl: new FormControl(""),
    fromDateControl: new FormControl(""),
    toDateControl: new FormControl(""),
    dateControl: new FormControl("")
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  /* new components functions */
  onInputChangeDate(event: Date) {
    this.date = event;
  }

  onInputChangeRange(event: { fromDate: Date; toDate: Date }) {
    this.fromDate = event?.fromDate;
    this.toDate = event?.toDate;
  }

  onInputChangeDateTime(event: Date) {
    this.dateTimePickerWithTime = event;
  }

  onInputChangeTime(event: any) {
    this.timePickerInput = event;
  }

  startPath: string = "http://localhost:5000/api/Call";

  SaveDate(date: Date) {
    return this.http.post<any>(this.startPath + "/SaveDate", date).toPromise();
  }

  SaveDateTime(date: Date) {
    return this.http.post<any>(this.startPath + "/SaveDateTime", date).toPromise();
  }

  SaveRange(fromDate: Date, toDate: Date) {
    return this.http.post<any>(this.startPath + "/SaveRange", [fromDate, toDate]).toPromise();
  }

  SaveTime(time: Time) {
    return this.http.post<any>(this.startPath + "/SaveTime", time).toPromise();
  }

  onClickSaveDate() {
    /* MATERIAL DATE PICKER */
    console.log(this.date, "client-input-d");
    this.SaveDate(this.date)
      .then((res) => console.log(res, "response"))
      .catch((error) => console.log(error));
  }

  onClickSaveDateTime() {
    /* NGX MAT DATETIME PICKER */
    console.log(this.dateTimePickerWithTime, "client-input-dt");
    this.SaveDateTime(this.dateTimePickerWithTime)
      .then((res) => console.log(res, "response"))
      .catch((error) => console.log(error));
  }

  onClickSaveRange() {
    /* MATERIAL DATE RANGE */
    console.log([this.fromDate, this.toDate], "client-input-dr");
    this.SaveRange(this.fromDate, this.toDate)
      .then((res) => console.log(res, "response"))
      .catch((error) => console.log(error));
  }

  onClickSaveTime() {
    /* NGX MAT TIME */
    var timeTokens: number[] = this.timePickerInput.split(":").map((e) => Number(e));
    const tmpTime = { hours: timeTokens[0], minutes: timeTokens[1] };
    console.log(tmpTime, "client-input-t");

    this.SaveTime(tmpTime)
      .then((res) => console.log(res, "response"))
      .catch((error) => console.log(error));
  }
}
