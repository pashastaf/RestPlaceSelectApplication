import { forwardRef } from "react";
import { Pressable, StyleSheet, Text, type View } from "react-native";
import Colors from "../constants/Colors";

type ButtonProps = {
  text: string;
  color?: string; // Добавляем опциональное свойство color в ButtonProps
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, color, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={({pressed}) => [styles.container, { backgroundColor: color, opacity: pressed ? 0.5 : 1 }]}
      >
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.light.tint,
		padding: 15,
		alignItems: "center",
		borderRadius: 100,
		marginVertical: 10,
	},
	text: {
		fontSize: 16,
		fontWeight: "600",
		color: "white",
	},
});

export default Button;
