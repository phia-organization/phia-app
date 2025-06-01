/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Colors";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.default
) {
  const colorFromProps = props.dark;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors.default[colorName];
  }
}
