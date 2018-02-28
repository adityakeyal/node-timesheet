var moment = require('moment');

module.exports={

    formatDate : function (date){

        var date = typeof date  !== 'undefined' ?  date  : new Date();


        return   moment(date).format("DD-MM-YYYY");

    },

    fetchRange : function(date){



}














}