import { call, put, takeEvery } from "redux-saga/effects";

import userSlice from "../slice/userSlice";
import loginSlice from "../slice/loginSlice";
import { findUser, insertUser } from "../../utils/services";

function* callUserGetFun(payload) {
  let res = yield call(findUser, payload.payload);
  console.log("USERDETAILSLOG", res.data.user.role);
  localStorage.setItem("name", res.data.user.name);
  localStorage.setItem("role", res.data.user.role);

  yield put(
    loginSlice.actions.saveToken({
      name: res.data.user.name,
      role: res.data.user.role,
      token: res.data.accessToken,
    }),
  );
  payload.payload.navigate("/datatable");
}
function* callUserRegFun(payload) {
  yield call(insertUser, payload);
  payload.payload.navigate("/");
}

export function* callUserFun() {
  yield takeEvery(userSlice.actions.logInUser, callUserGetFun);
  yield takeEvery(userSlice.actions.registerUser, callUserRegFun);
}
