import { Platform, TouchableOpacity, View, Text } from "react-native";
import { Dialog, useToast } from "../../../components";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { dateTime, moderateFontScale, useTheme } from "../../../tools";
import { DateTimePickerProps } from "./types";
import React from "react";

export function DateTimePickerDialog({
  action,
  show,
  onCencel,
  onChangeDate,
  onChangeTime,
  onChangeDateAndroid,
  date,
  time,
}: DateTimePickerProps) {
  const theme = useTheme();
  return (
    <Dialog
      styles={{ width: "90%" }}
      backgroundBlur={Platform.OS === "ios"}
      animation="fade"
      action={action}
      actionLabel="Set reminder"
      title="Schedule a reminder for task"
      onCencel={onCencel}
      visible={show}
    >
      {Platform.OS === "ios" && (
        <View style={{ rowGap: 0, height: "100%" }}>
          <Text
            style={{
              fontSize: moderateFontScale(15),
              color: "green",
              textAlign: "center",
            }}
          >
            Max 200-250 words per notification
          </Text>
          <DateTimePicker
            minimumDate={new Date()}
            style={{ height: "50%" }}
            mode="date"
            value={date}
            display="spinner"
            onChange={onChangeDate}
          />
          <DateTimePicker
            is24Hour
            style={{ height: "50%" }}
            mode="time"
            value={time}
            display="spinner"
            onChange={onChangeTime}
          />
        </View>
      )}
      {Platform.OS === "android" && (
        <>
          <Text
            style={{
              fontSize: moderateFontScale(15),
              color: "green",
              textAlign: "center",
            }}
          >
            Max 200-250 words per notification
          </Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: moderateFontScale(20),
                fontWeight: "bold",
                color: theme.onPrimary,
              }}
            >{`Date: ${dateTime(date).split(" ")[0]}`}</Text>
            <Text
              style={{
                fontSize: moderateFontScale(20),
                fontWeight: "bold",
                color: theme.onPrimary,
              }}
            >{`Hour: ${dateTime(time).split(" ")[1]}`}</Text>
          </View>
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() => {
              DateTimePickerAndroid.open({
                minimumDate: new Date(),
                mode: "date",
                value: date,
                display: "spinner",
                onChange: onChangeDateAndroid,
              });
            }}
          >
            <Text
              style={{
                color: "blue",
                fontSize: moderateFontScale(20),
                fontWeight: "bold",
              }}
            >
              Change
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Dialog>
  );
}
