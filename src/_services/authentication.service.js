import { BehaviorSubject } from 'rxjs';
import {handleResponse} from "../_helpers/handle-response";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')));

export const authService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${process.env.VUE_APP_ROOT_API}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                currentUserSubject.next(user);
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    currentUserSubject.next(null);
}