import { Link } from "expo-router";
import Button from "../components/Button";
import { View } from "../components/Themed";

const index = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
        <Link href={'/sign-in'} asChild>
          <Button text="Sign in" />
        </Link>
      </View>
    );
  };
  
  export default index;