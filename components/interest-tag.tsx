import React from "react";
import { Chip, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

interface InterestTagProps {
  interest: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export function InterestTag({
  interest,
  selected = false,
  onPress,
  disabled = true,
}: InterestTagProps) {
  const theme = useTheme();

  return (
    <Chip
      mode={selected ? "flat" : "outlined"}
      selected={selected}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.chip,
        selected && { backgroundColor: theme.colors.primaryContainer },
      ]}
      textStyle={styles.chipText}
    >
      {interest}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    margin: 4,
  },
  chipText: {
    fontSize: 14,
  },
});
