import { Link } from "expo-router";
import Button from "../components/Button";

const index = () => {
    return (
        <Link href={'/sign-in'} asChild>
          <Button text="Sign in" />
        </Link>
    );
  };
  
  export default index;