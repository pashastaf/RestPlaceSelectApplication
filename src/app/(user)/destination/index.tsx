import { useDestinationList, useFeaturesForDestinations } from "@/src/api/destination";
import DestinationListItem from "@/src/components/DestinationListItem";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	TextInput,
	View,
	Text,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function DestinationScreen() {
	const {
		data: destination,
		error,
		isLoading,
	} = useDestinationList();
	const { data: features } = useFeaturesForDestinations();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState([]);
	const [hideView, setHideView] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [filterQuery, setFilterQuery] = useState(destination);
	const [searchQuery, setSearchQuery] = useState(destination);

	useEffect(() => {
		if (filterQuery) {
			setSearchQuery(filterQuery);
			setInputValue('');
		}
	}, [filterQuery])

	useEffect(() => {
		async function fetchData() {
			if (value.length > 0) {
				const { data, error } = await supabase.rpc('filter_destinations', { selected_features_id: value });
				if (error) {
					console.error('Ошибка при выполнении запроса:', error.message);
				} else {
					setFilterQuery(data);
				}
			}
			else {
				setFilterQuery(destination)
			}
		}
		fetchData();
	}, [value, destination]);

	async function handleFilter(search: string) {
		setInputValue(search)
		if (filterQuery) {
			setSearchQuery(
				filterQuery.filter((item) =>
					item.title.toLowerCase().includes(search.toLowerCase()),
				),
			);
		}
	}

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text> Failed to fetch product </Text>;
	}

	if (!features) {
		return <ActivityIndicator />;
	}

	const itemsFeatures = features.map((feature) => ({
		label: feature.title,
		value: feature.id.toString(),
	}));

	return (
		<View style={{ backgroundColor: "white" }}>
			<View style={styles.seacrhButton}>
				<TextInput
					placeholder="Search"
					clearButtonMode="always"
					style={styles.searchBox}
					autoCapitalize="none"
					value={inputValue}
					autoCorrect={false}
					onChangeText={handleFilter}
				/>
				<View>
					<Pressable
						onPress={() => {
							setHideView(!hideView);
						}}
					>
						{({ pressed }) => (
							<Feather
								name="sliders"
								size={25}
								color={Colors.light.tint}
								style={{
									opacity: pressed ? 0.5 : 1,
								}}
							/>
						)}
					</Pressable>
				</View>
			</View>
			{hideView && (
				<DropDownPicker
					style={[styles.filterBox, { paddingHorizontal: 20 }]}
					dropDownContainerStyle={styles.filterBox}
					placeholder="Select filter"
					placeholderStyle={{ color: 'gray' }}
					open={open}
					value={value}
					items={itemsFeatures}
					setOpen={setOpen}
					setValue={setValue}
					setItems={() => { }}
					multiple={true}
					mode="BADGE"
					badgeDotColors={[
						"#e76f51",
						"#00b4d8",
						"#e9c46a",
						"#e76f51",
						"#8ac926",
						"#00b4d8",
						"#e9c46a",
					]}
				/>
			)}
			<FlatList
				data={searchQuery}
				renderItem={({ item }) => (
					<DestinationListItem destination={item} />
				)}
				contentContainerStyle={{ gap: 10, padding: 10 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	searchBox: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 8,
		width: "90%",
	},
	seacrhButton: {
		marginHorizontal: 15,
		marginVertical: 15,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: 'center'
	},
	filterBox: {
		alignSelf: "center",
		borderColor: '#ccc',
		borderRadius: 8,
		width: '93%'
	}
});
