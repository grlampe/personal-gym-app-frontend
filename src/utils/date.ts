import moment from "moment";

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

        return moment(new Date(date)).format('YYYY-MM-DD');
    }
}
