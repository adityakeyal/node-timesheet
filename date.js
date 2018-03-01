var moment = require('moment');


/**
 * Export a variable with exposed methods through an anonymous function
 */

module.exports = (function() {


    /**
     * <PRIVATE METHOD>
     * Returns the date range in the format DD-MM-YYYY
     * to the current date
     */
    function rangeDates(date = new Date(), processCallBack) {



        var todayWithoutTime = moment(date).startOf('day');
        var startOfMonth = moment(todayWithoutTime).startOf('month');
        var diff = (todayWithoutTime.date() - startOfMonth.date());
        var daysOfMonth = [];

        for (var i = 0; i <= diff; i++) {
            daysOfMonth.push(processCallBack(startOfMonth));
            startOfMonth = startOfMonth.add(1, 'day');
        }

        return daysOfMonth;
    }

    /**
     * <PRIVATE METHOD>
     * @param {*} date 
     */
    function formatDate(date) {

        return moment(date).format("DD-MM-YYYY");

    }


    var dateExport = {

        /**
         * Format Date Method used to format the date in DD-MM-YYYY format
         * If no argument is provided formats the current date
         */
        formatDate: function(date = new Date()) {
            return formatDate(date);
        },


        fetchDaysInMonth: function(date) {
            var formatMomentToDate = function(momentDate) { return formatDate(momentDate.toDate()) };
            return rangeDates(date, formatMomentToDate);
        },

        fetchBusinessDaysInMonth: function(date) {
            var formatMomentToDate = function(momentDate) { return momentDate.clone(); };
            var dateRange = rangeDates(date, formatMomentToDate);
            return dateRange.filter(d => (d.day() != 0 && d.day() != 6)).map(x => formatDate(x));
        }


    }

    return dateExport;

}());