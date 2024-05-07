import { useFeatures, useRestPlaceList } from "@/src/api/restplace";
import RestPlaceListItem from "@/src/components/RestPlaceListItem";
import { View } from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TextInput
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function RestPlaceScreen() {
	const { data: restPlaces, isLoading, error } = useRestPlaceList();
	const { data: features } = useFeatures();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState([]);
	const [hideView, setHideView] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [filterQuery, setFilterQuery] = useState(restPlaces);
	const [searchQuery, setSearchQuery] = useState(restPlaces);

	console.log(value)
	console.log('FILTER', filterQuery)
	console.log('SEACRH', searchQuery)

	useEffect(() => {
		if (filterQuery) {
			setSearchQuery(filterQuery);
			setInputValue('');
		}
	}, [filterQuery])

	useEffect(() => {
		async function fetchData() {
			if (value.length > 0) {
				const { data, error } = await supabase.rpc('filter_rest_places', { selected_features_id: value });
				if (error) {
					console.error('Ошибка при выполнении запроса:', error.message);
				} else {
					setFilterQuery(data);
				}
			}
			else {
				setFilterQuery(restPlaces)
			}
		}
		fetchData();
	}, [value, restPlaces]);

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
		return <Text>Failed to fetch</Text>;
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
			<View style={styles.filterBlock}>
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
									marginTop: 17,
									marginLeft: 15,
									height: 40,
								}}
							/>
						)}
					</Pressable>
				</View>
			</View>
			{hideView && (
				<DropDownPicker
					style={{ marginTop: 60, width: "90%", alignSelf: "center" }}
					dropDownContainerStyle={{ marginTop: 60, width: "90%", alignSelf: "center" }}
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
				style={{ marginTop: 50 }}
				renderItem={({ item }) => (
					<RestPlaceListItem restPlace={item} />
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
		marginTop: 10,
		width: "90%",
		height: 40,
	},
	filterBlock: {
		flex: 1,
		marginHorizontal: 20,
		flexDirection: "row",
	},
});
