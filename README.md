# Table of contents

- [Getting started](#getting-started)
- [API](#api)
- [Use cases](#use-cases)
- [Credits](#credits)

## Required

- [x] Angular Material installed and imported
- [x] @angular-material-components/datetime-picker (v8.0.0)
- [x] @angular-material-components/moment-adapter (v8.0.0)
- [x] Moment.js

## Getting started

This package is based on angular material and momentjs and allows to create 4 kind of date/time picker: date only, time only, both and a date range.

##### Notes

By default returns the seletected date converted in UTC time zone.

### Step 1: Install `eqp-datetimepicker`:

#### NPM

```shell
npm install --save @eqproject/eqp-datetimepicker [TODO]
```

If needed dependecies are not installed run this commands:

```shell
npm i @angular-material-components/datetime-picker@8.0.0
npm install --save  @angular-material-components/moment-adapter
npm install moment --save
```

### Step 2:

#### Import EqpDatetimepickerModule, NgxMatDatetimePickerModule and NgxMatTimepickerModule :

```js
import { EqpDatetimepickerModule } from "@eqproject/eqp-datetimepicker";
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from "@angular-material-components/datetime-picker";

@NgModule({
  declarations: [AppComponent],
  imports: [EqpDatetimepickerModule, NgxMatDatetimePickerModule, NgxMatTimepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## API

### Inputs

| Input                       | Type             | Default                                                                                               | Required | Description                                                                                                                                                                               |
| --------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [type]                      | `PickerModeEnum` | `null`                                                                                                | yes      | Defines the view mode of the picker.                                                                                                                                                      |
| [readonlyInput]             | `boolean`        | `true`                                                                                                | no       | Defines the input area as read only. if true the value can be changed only trougth the calendar.                                                                                          |
| [minDate]                   | `Date            | null`                                                                                                 | `null`   | no                                                                                                                                                                                        | Sets the lowest date that can be inserted.                                                                                                                                                                       |
| [maxDate]                   | `Date            | null`                                                                                                 | `null`   | no                                                                                                                                                                                        | Sets the highest date that can be inserted.                                                                                                                                                                      |
| [isRequired]                | `boolean`        | `false`                                                                                               | no       | Marks the input as required.                                                                                                                                                              |
| [formGroupInput]            | `FormGroup       | null`                                                                                                 | `null`   | no                                                                                                                                                                                        | FormGroup in which the eqp-datetimepicker is used. If not null then `formControlNameInput` is required.                                                                                                          |
| [formControlNameInput]      | `string          | null`                                                                                                 | `null`   | no                                                                                                                                                                                        | Has effect only if `formGroupInput` is not null. FormControlName of the control used in the defined `formGroupInput`. (NOTE: use it without `ngModelInput`).                                                     |
| [formControlNameInputStart] | `string          | null`                                                                                                 | `null`   | no                                                                                                                                                                                        | FormControlName used for the start date of the DATE_RANGE picker. (NOTE: use it instead `formControlName` without `ngModelInput`, in order to work you also need to specify `formControlNameInputEnd` property). |
| [formControlNameInputEnd]   | `string          | null`                                                                                                 | `null`   | no                                                                                                                                                                                        | FormControlName used for the end date of the DATE_RANGE picker. (NOTE: use it instead `formControlName` without `ngModelInput`, in order to work you also need to specify `formControlNameInputStart` property). |
| [ngModelInput]              | `Date            | string                                                                                                | null`    | `null`                                                                                                                                                                                    | no                                                                                                                                                                                                               | ngModel to bind the inputfor all kind of picker. (NOTE: use it instead formGroup and formControl binding) |
| [placeholder]               | `string`         | `DATE: "Seleziona una data", DATETIME: "Seleziona una data e un orario", TIME: "Seleziona un orario"` | no       | placeholder viewed in case of DATE, DATETIME or TIME picker.                                                                                                                              |
| [startPlaceholeder]         | `string`         | `DATE_RANGE: "Seleziona data inizio"`                                                                 | no       | placeholder viewed in case of DATE_RANGE picker forn the stat date. (NOTE: use it instead `placeholder` property, in order to work you also need to specify `endPlaceholeder` property).  |
| [endPlaceholeder]           | `string`         | `DATE_RANGE: "fine"`                                                                                  | no       | placeholder viewed in case of DATE_RANGE picker forn the end date. (NOTE: use it instead `placeholder` property, in order to work you also need to specify `startPlaceholeder` property). |
| [disabled]                  | `boolean`        | `false`                                                                                               | no       | If true, the picker is readonly and can't be modified.                                                                                                                                    |
| [showSpinners]              | `boolean`        | `true`                                                                                                | no       | If true, the spinners above and below input are visible                                                                                                                                   |
| [showSeconds]               | `boolean`        | `true`                                                                                                | no       | If true, it is not possible to select seconds                                                                                                                                             |
| [disableMinute]             | `boolean`        | `false`                                                                                               | no       | If true, the minute is readonly.                                                                                                                                                          |
| [stepSecond]                | `number`         | `1`                                                                                                   | no       | The number of seconds to add/substract when clicking second spinners.                                                                                                                     |
| [stepHour]                  | `number`         | `1`                                                                                                   | no       | The number of hours to add/substract when clicking hour spinners.                                                                                                                         |
| [stepMinute]                | `number`         | `1`                                                                                                   | no       | The number of minutes to add/substract when clicking minute spinners.                                                                                                                     |
| [color]                     | `ThemePalette`   | `undefined`                                                                                           | no       | Color palette to use on the datepicker's calendar.                                                                                                                                        |
| [enableMeridian]            | `boolean`        | `false`                                                                                               | no       | Whether to display 12H or 24H mode.                                                                                                                                                       |
| [touchUi]                   | `boolean`        | `false`                                                                                               | no       | Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather than a popup and elements have more padding to allow for bigger touch targets.              |

### Outputs

| Output       | Event Arguments     | Required | Description                                                                                                                                               |
| ------------ | ------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (dateChange) | `EventEmitter<any>` | no       | Invoked when the selected value changes. The output type is the same as the `ngModelInput` type. WARNING: Do not use the old `ngModelInputChange` output. |

### Model, Interfaces and Enums used

#### Enums description

| EnumType         | Description                         | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PickerModeEnum` | Define the view mode of the picker. | Has the following values: `DATETIME = 1` -> shows a picker to select date and time; `DATE = 2` -> shows a date only picker and the returned time of date is set to ("00:00:00"); `TIME = 3` -> shows a time only picker which returns the selected time; `DATE_RANGE = 4` -> shows a date only picker where can be selected the initial and the end date of a range, and returns the start and the end dates with time ("00:00:00"); |

<!-- ## Use cases
### Use Example in class :

##### Notes
The following examples do not include the use of a form. To do so you need to create a form in the .ts file and use the above inputs to pass it to the directive.


CASE 1: Date and time mode
```html
    <eqp-datetimepicker [placeholder]="placeholder" [(ngModelInput)]="selectedDateTime" [UTCDate]="true" [isRequired]="true"
        [pickerMode]="pickerModeEnum.DATETIME" [disabled]="false" (ngModelInputChange)="onDateChange($event)">
    </eqp-datetimepicker>
```

```js
    import { PickerModeEnum } from '@eqproject/eqp-datetimepicker';

    selectedDateTime: Date; // or you can set it to any value (for example = new Date();)
    placeholder: string = "Select a date";
    pickerModeEnum = PickerModeEnum;

    onDateChange(event) {
        // TODO
    }
```

CASE 2: Date only picker
```html
    <eqp-datetimepicker [placeholder]="placeholder" [(ngModelInput)]="selectedDate" [UTCDate]="true" [isRequired]="true"
        [pickerMode]="pickerModeEnum.DATE" [disabled]="false" (ngModelInputChange)="onDateChange($event)">
    </eqp-datetimepicker>
```

```js
    import { PickerModeEnum } from '@eqproject/eqp-datetimepicker';

    selectedDate: Date; // or you can set it to any value (for example = new Date();)
    placeholder: string = "Select a date";
    pickerModeEnum = PickerModeEnum;

    onDateChange(event) {
        // TODO
    }
```

CASE 3: Time only picker
```html
    <eqp-datetimepicker [placeholder]="placeholder" [(ngModelInput)]="selectedTime" [timeType]="timeTypeEnum.STRING" [UTCDate]="true"
        [pickerMode]="pickerModeEnum.TIME" [isRequired]="true" (ngModelInputChange)="onDateChange($event)">
    </eqp-datetimepicker>
```

```js
    import { PickerModeEnum, TimeTypeEnum } from '@eqproject/eqp-datetimepicker';

    // You can choose from 3 different input types, try them:
    selectedTime: string = "23:59";
    // selectedTime: number = 1631807434670;
    // selectedTime: Date; // or you can set it to any value (for example = new Date();)
    placeholder: string = "Select a date";
    pickerModeEnum = PickerModeEnum;
    timeTypeEnum = TimeTypeEnum;

    onDateChange(event) {
        // TODO
    }
``` -->

## Credits

This library has been developed by EqProject SRL, for more info contact: info@eqproject.it
