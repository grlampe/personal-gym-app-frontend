import moment from 'moment';

export class DateUtils {
    static formatDate(date: string): string {
        if(!date){
            return '';
        }

        return moment(date).format('DD/MM/YYYY HH:mm');
    }

    static formatDateWithoutTime(date: string): string {
        if(!date){
            return '';
        }

        return moment(date).format('DD/MM/YYYY');
    }

    static formatDateToBackend(date: string): string {
        if(!date){
            return '';
        }

        return moment(date).format('YYYY-MM-DD');
    }

    static formatUTCDateToBackend(date: string): string {
        if(!date){
            return '';
        }

        return moment.utc(date).format('YYYY-MM-DD');
    }
}
