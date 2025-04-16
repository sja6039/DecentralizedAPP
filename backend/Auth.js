import { auth } from "./Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail, signOut } from "firebase/auth";

export const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const isEmailInUse = async (email) => {
    try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        return signInMethods;
    } catch (error) {
        console.error("Error checking email: ",error);
        return false;
    }

};

export const logOut = () => {
    return signOut(auth);
};


