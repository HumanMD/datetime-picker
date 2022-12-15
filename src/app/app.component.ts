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
  timePickerInput: any = "14:11:14";
  dateTimePickerWithTime: any = new Date();
  date: any = new Date();
  range: any = { from: new Date(), to: new Date() };
  disable = false;

  formGroup = new FormGroup({
    timePickerInputControl: new FormControl(this.timePickerInput),
    dateTimePickerWithTimeControl: new FormControl(this.dateTimePickerWithTime),
    dateRangeControlStart: new FormControl(this.range?.from),
    dateRangeControlEnd: new FormControl(this.range?.to),
    dateControl: new FormControl(this.date)
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  /* new components functions */

  startPath: string = "http://localhost:5000/api/Call";

  SaveDate(date: Date) {
    return this.http.post<any>(this.startPath + "/SaveDate", date).toPromise();
  }

  SaveDateTime(date: Date) {
    return this.http.post<any>(this.startPath + "/SaveDateTime", date).toPromise();
  }

  SaveRange(range: Object) {
    return this.http.post<any>(this.startPath + "/SaveRange", range).toPromise();
  }

  SaveTime(time: Time) {
    return this.http.post<any>(this.startPath + "/SaveTime", time).toPromise();
  }

  onClickSaveDate() {
    /* MATERIAL DATE PICKER */
    console.log(this.date, "client-input-d");
    /* this.SaveDate(this.date)
      .then((res) => console.log(res, "response"))
      .catch((error) => console.log(error)); */
  }

  onClickSaveDateTime() {
    /* NGX MAT DATETIME PICKER */
    console.log(this.dateTimePickerWithTime, "client-input-dt");
    /* this.SaveDateTime(this.dateTimePickerWithTime)
      .then((res) => console.log(res, "response"))
      .catch((error) => console.log(error)); */
  }

  onClickSaveRange() {
    /* MATERIAL DATE RANGE */

    console.log(this.range, "client-input-dr");
    /* this.SaveRange(this.range)
      .then((res) => console.log(res, "response"))
      .catch((error) => console.log(error)); */
  }

  onClickSaveTime() {
    /* NGX MAT TIME */
    /* var timeTokens: number[] = this.timePickerInput.split(":").map((e) => Number(e));
    const tmpTime = { hours: timeTokens[0], minutes: timeTokens[1] };
    console.log(tmpTime, "client-input-t");

    this.SaveTime(tmpTime)
      .then((res) => console.log(res, "response"))
      .catch((error) => console.log(error)); */
  }
}
