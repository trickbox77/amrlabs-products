import axios from "../../axios.js";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
export default {
  login({ commit, state, dispatch }, payload) {
    const auth = getAuth();

    if (payload.userDetails.email.toUpperCase() === "GUEST") {
      dispatch("updateUsername", {
        token: payload.userDetails.email,
        id: payload.userDetails.email,
        name: payload.userDetails.email,
        email: payload.userDetails.email,
        roles: ['ADMIN'],
        isReloadRequired: true,
      });
    }
    else {
      signInWithEmailAndPassword(auth, payload.userDetails.email, payload.userDetails.password)
          .then((userCredential) => {
            const user1 = userCredential.user;
            console.log(user1);
            if (payload.closeAnimation) payload.closeAnimation.close();
            dispatch("updateUsername", {
              token: user1.refreshToken,
              id: user1.id,
              name: user1.displayName,
              email: user1.email,
              roles: ['ADMIN'],
              isReloadRequired: true,
            });
          })
          .catch((e) => {
            const _error = e.message
                ? e.message
                : "잘못된 계정입니다.";
            if (payload.closeAnimation) payload.closeAnimation.close();
            payload.notification({
              sticky: true,
              title: "메세지",
              duration: 5000,
              text: _error,
              color: "#f44336",
              icon: '<i class="fa-regular fa-circle-exclamation"></i>',
              position: "bottom-center",
            });
          });
    }
  },

  updateUsername({ commit }, payload) {
    // If username update is success
    // update in localstorage
    const newUserData = Object.assign({}, payload);
    newUserData.token = payload.token;
    newUserData.id = payload.id;
    newUserData.name = payload.name;
    newUserData.email = payload.email;
    newUserData.roles = payload.roles;
    newUserData.manager = payload.manager;

    delete newUserData["isReloadRequired"];

    commit("UPDATE_USER_INFO", newUserData, { root: true });

    // If reload is required to get fresh data after update
    // Reload current page
    if (payload.isReloadRequired) {
      window.location.reload();
    }
  },
};
