import {Role} from "../_helpers/role";

export const users = [
    { id: 1, username: 'admin', password: 'adminuser', firstName: 'Admin', lastName: 'User', role: Role.Admin },
    { id: 2, username: 'user', password: 'useruser', firstName: 'Common', lastName: 'User', role: Role.User }
];