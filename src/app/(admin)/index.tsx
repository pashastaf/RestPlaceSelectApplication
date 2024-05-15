import { Redirect } from "expo-router";

export const DefaultImage =
	"https://previews.123rf.com/images/koblizeek/koblizeek2208/koblizeek220800254/190563481-no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg";

export const DefaultAvatar = 
	"https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?w=512&ssl=1"

export default function TabIndex() {
	return <Redirect href={"/(admin)/destination/"} />;
}
