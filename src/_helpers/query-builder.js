export function parseQueryParams(...queryParams) {
    const separator = ',';
    let returnQueryParams = '&references=';
    let filtered = queryParams.map(v => v === undefined ? "-1" : v);
    for (let i = 0; i < filtered.length; i++) {
        let param = filtered[i];
        if (filtered.length === i + 1) {
            returnQueryParams += param;
        } else {
            returnQueryParams += param.concat(separator);
        }
    }
    return returnQueryParams;
}