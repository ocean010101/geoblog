import moment from 'moment'
export function data(value) {
    return moment(value).format('L');
}