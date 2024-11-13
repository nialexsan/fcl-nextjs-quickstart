import * as fcl from "@onflow/fcl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTransaction } from "./TransactionContext";
import ReadProfileScript from "../cadence/scripts/read-profile.cdc"
import CreateProfileTransaction from "../cadence/transactions/create-profile.cdc"
import UpdateProfileTransaction from "../cadence/transactions/update-profile.cdc"

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const { initTransactionState, setTxId, setTransactionStatus } =
    useTransaction();
  const [currentUser, setUser] = useState({ loggedIn: false, addr: undefined });
  const [userProfile, setProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const loadProfile = useCallback(async () => {
    const profile = await fcl.query({
      cadence: ReadProfileScript,
      args: (arg, t) => [arg(currentUser.addr, t.Address)],
    });
    setProfile(profile ?? null);
    setProfileExists(profile !== null);
    return profile;
  }, [currentUser, setProfile, setProfileExists]);

  useEffect(() => {
    // Upon login check if a userProfile exists
    if (currentUser.loggedIn && userProfile === null) {
      loadProfile();
    }
  }, [currentUser, userProfile, loadProfile]);

  const logOut = async () => {
    await fcl.unauthenticate();
    setUser({ addr: undefined, loggedIn: false });
    setProfile(null);
    setProfileExists(false);
  };

  const logIn = () => {
    fcl.logIn();
  };

  const signUp = () => {
    fcl.signUp();
  };

  const createProfile = async () => {
    initTransactionState();

    const transactionId = await fcl.mutate({
      cadence: CreateProfileTransaction,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });
    setTxId(transactionId);
    fcl.tx(transactionId).subscribe((res) => {
      setTransactionStatus(res.status);
      if (res.status === 4) {
        loadProfile();
      }
    });
  };

  const updateProfile = async ({ name, color, info }) => {
    console.log("Updating profile", { name, color, info });
    initTransactionState();

    const transactionId = await fcl.mutate({
      cadence: UpdateProfileTransaction,
      args: (arg, t) => [
        arg(name, t.String),
        arg(color, t.String),
        arg(info, t.String),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });
    setTxId(transactionId);
    fcl.tx(transactionId).subscribe((res) => {
      setTransactionStatus(res.status);
      if (res.status === 4) {
        loadProfile();
      }
    });
  };

  const value = {
    currentUser,
    userProfile,
    profileExists,
    logOut,
    logIn,
    signUp,
    loadProfile,
    createProfile,
    updateProfile,
  };

  console.log("AuthProvider", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
