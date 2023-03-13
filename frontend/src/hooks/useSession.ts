import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as UsersApi from "../network/users_api";

export default function useSession() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoggedInUser(null)
      UsersApi.getLoggedInUser()
        .then(response => setLoggedInUser(response))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return { loggedInUser, loading, setLoggedInUser };
}