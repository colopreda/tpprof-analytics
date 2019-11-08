import { authHeader } from '../_helpers';
import { handleResponse } from "../_helpers/handle-response";

export const userService = {
    getAll
};

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${process.env.VUE_APP_ROOT_API}/users`, requestOptions).then(handleResponse);
}