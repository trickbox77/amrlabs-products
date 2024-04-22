

const mutations = {


  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////

  // Updates user info in state and localstorage
  UPDATE_USER_INFO(state, payload) {

    // Get Data localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || state.AppActiveUser;

    for (const property of Object.keys(payload)) {

      if (payload[property] !== null) {
        // If some of user property is null - user default property defined in state.AppActiveUser
        state.AppActiveUser[property] = payload[property]

        // Update key in localStorage
        userInfo[property] = payload[property]
      }
    }


    // Store data in localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }
}

export default mutations

