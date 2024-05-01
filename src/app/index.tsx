import { Link, Redirect } from "expo-router";
import Button from "../components/Button";
import { View } from "../components/Themed";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";
import { ActivityIndicator } from "react-native";

const index = () => {
  
  const { session, loading, isAdmin, profile } = useAuth();

  if(loading) {
    return<ActivityIndicator />;
  }
  console.log('INDEX',session)
  console.log('INDEX',profile)
  if(!session) {
    return <Redirect href={'/sign-in'}/>  
  }

  if(!isAdmin) {
    return <Redirect href={'/(user)'} />
  }
  else {
    return <Redirect href={'/(admin)'} />
  }
};

export default index;


