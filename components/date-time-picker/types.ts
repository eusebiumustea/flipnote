import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export interface DateTimePickerProps {
  onChangeTime: (event: DateTimePickerEvent, date: Date) => void;
  onChangeDate: (event: DateTimePickerEvent, date: Date) => void;
  onChangeDateAndroid: (event: DateTimePickerEvent, date: Date) => void;
  time: Date;
  date: Date;
  show: boolean;
  onCancel: () => void;
  action: () => void;
}
